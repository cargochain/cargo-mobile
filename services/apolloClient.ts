import { ApolloClient, InMemoryCache, from, gql } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import Observable from "zen-observable";
import {
  getAccessToken,
  getRefreshToken,
  storeAccessToken,
  storeRefreshToken,
  clearAuthData,
} from "./secureStorage";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

// Mock GraphQL endpoint - replace with your actual endpoint
// const API_URL = "http://localhost:8080/graphql";
const API_URL = "https://1d5d-148-71-175-76.ngrok-free.app/graphql";

// Create Upload link for file uploads
const uploadLink = createUploadLink({
  uri: API_URL,
  credentials: "include",
});

const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;

let isRefreshing = false;
let pendingRequests: any[] = [];

// Function to refresh token and retry the operation
const refreshTokenAndRetry = async (operation: any) => {
  try {
    console.log("refreshTokenAndRetry");
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      await clearAuthData();
      return null;
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push(() => resolve(operation));
      });
    }

    isRefreshing = true;

    // Use a temporary ApolloClient instance to avoid circular dependency
    const tempClient = new ApolloClient({
      link: uploadLink,
      cache: new InMemoryCache(),
    });

    const response = await tempClient.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: { refreshToken },
    });

    const { accessToken, refreshToken: newRefreshToken } =
      response.data.refreshToken;

    if (accessToken && newRefreshToken) {
      // Store both new tokens
      await storeAccessToken(accessToken);
      await storeRefreshToken(newRefreshToken);

      // Update the operation context with the new token
      const oldHeaders = operation.getContext().headers;
      operation.setContext({
        headers: {
          ...oldHeaders,
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Process any pending requests
      pendingRequests.forEach((callback) => callback());
      pendingRequests = [];
      isRefreshing = false;

      console.log("refreshTokenAndRetry success");
      return true;
    } else {
      await clearAuthData();
      return null;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    await clearAuthData();
    isRefreshing = false;
    pendingRequests = [];
    return null;
  }
};

// Auth link to add token to requests
const authLink = setContext(async (_, { headers }) => {
  const token = await getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Error handling link with async token refresh and retry
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (err.message === "unauthorized") {
          // Return a new Observable that waits for token refresh and retries
          return new Observable((observer) => {
            (async () => {
              try {
                const refreshed = await refreshTokenAndRetry(operation);
                if (refreshed) {
                  // Retry the request with the new token
                  forward(operation).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                  });
                } else {
                  observer.error(new Error("Authentication failed"));
                }
              } catch (error) {
                observer.error(error);
              }
            })();
          });
        }
        console.error(
          `[GraphQL error]: Message: ${err.message}, Location: ${err.locations}, Path: ${err.path}`
        );
      }
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  }
);

// Compose links: errorLink -> authLink -> uploadLink
export const client = new ApolloClient({
  link: from([errorLink, authLink, uploadLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
