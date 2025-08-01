import { components } from "@/lib/rest-api.types";
import {
  getAccessToken,
  getRefreshToken,
  storeAccessToken,
  storeRefreshToken,
  clearAuthData,
} from "./secureStorage";

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}`;
const TOKEN_REFRESH_URL = `${API_URL}/api/v1/token/refresh/`;

// Navigation callback for handling auth failures
let navigationCallback: (() => void) | null = null;

// Function to set navigation callback from auth context
export const setNavigationCallback = (callback: (() => void) | null) => {
  navigationCallback = callback;
};

// Interface for token refresh error response
interface TokenRefreshError {
  detail: string;
  code: string;
  messages: {
    token_class: string;
    token_type: string;
    message: string;
  }[];
}

// Function to refresh JWT token using REST API
const refreshJWTToken = async (
  refreshToken: string
): Promise<{ access: string; refresh: string } | null> => {
  try {
    const response = await fetch(TOKEN_REFRESH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    if (!response.ok) {
      // Handle specific 401 case when refresh token is invalid
      if (response.status === 401) {
        try {
          const errorData: TokenRefreshError = await response.json();
          console.error("Refresh token expired or invalid:", errorData);

          // Check if it's specifically a token expiration/invalid error
          if (errorData.code === "token_not_valid") {
            console.log("Refresh token is no longer valid, clearing auth data");
            return null; // This will trigger auth data clearing in the calling function
          }
        } catch (parseError) {
          console.error(
            "Failed to parse refresh token error response:",
            parseError
          );
        }
        return null;
      }

      throw new Error(`Token refresh failed: ${response.status}`);
    }

    const data =
      (await response.json()) as components["schemas"]["TokenRefresh"];
    return {
      access: data.access,
      refresh: data.refresh,
    };
  } catch (error) {
    console.error("JWT token refresh error:", error);
    return null;
  }
};

let isRefreshing = false;
let pendingRequests: (() => void)[] = [];

// Function to refresh token and retry the operation
const refreshTokenAndRetry = async (): Promise<string | null> => {
  try {
    console.log("refreshTokenAndRetry");
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      await clearAuthData();
      // Navigate to login page
      if (navigationCallback) {
        navigationCallback();
      }
      return null;
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push(() => resolve(getAccessToken()));
      });
    }

    isRefreshing = true;

    // Use REST API to refresh JWT token
    const tokenData = await refreshJWTToken(refreshToken);

    if (tokenData && tokenData.access && tokenData.refresh) {
      // Store both new tokens
      await storeAccessToken(tokenData.access);
      await storeRefreshToken(tokenData.refresh);

      // Process any pending requests
      pendingRequests.forEach((callback) => callback());
      pendingRequests = [];
      isRefreshing = false;

      console.log("refreshTokenAndRetry success");
      return tokenData.access;
    } else {
      await clearAuthData();
      // Navigate to login page
      if (navigationCallback) {
        navigationCallback();
      }
      return null;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    await clearAuthData();
    isRefreshing = false;
    pendingRequests = [];
    // Navigate to login page
    if (navigationCallback) {
      navigationCallback();
    }
    return null;
  }
};

// Generic API request function with automatic token refresh
export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const accessToken = await getAccessToken();

  // Add authorization header if token exists
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, try to refresh token and retry
  if (response.status === 401) {
    console.log("🛠️ Refreshing token...");
    const newToken = await refreshTokenAndRetry();
    if (newToken) {
      // Retry the request with the new token
      headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(url, {
        ...options,
        headers,
      });
    } else {
      console.log("🛠️ Failed to refresh token");
      await clearAuthData();
      if (navigationCallback) {
        navigationCallback();
      }
    }
  }

  return response;
};

// Convenience methods for common HTTP methods
export const apiGet = (url: string, options?: RequestInit) =>
  apiRequest(url, { ...options, method: "GET" });

export const apiPost = (url: string, data?: any, options?: RequestInit) =>
  apiRequest(url, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });

export const apiPut = (url: string, data?: any, options?: RequestInit) =>
  apiRequest(url, {
    ...options,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });

export const apiDelete = (url: string, options?: RequestInit) =>
  apiRequest(url, { ...options, method: "DELETE" });
