import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, useSegments } from "expo-router";
import {
  UserData,
  storeUserData,
  storeAccessToken,
  storeRefreshToken,
  clearAuthData,
  getAccessToken,
  getDeviceData,
  storeDeviceMetadata,
} from "./secureStorage";
import { client } from "./apolloClient";
import { gql } from "@apollo/client";
import * as LocalAuthentication from "expo-local-authentication";
import { useGetUserQuery, useSignInMutation } from "./generated/graphql";

// Define the shape of the auth context
interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (nif: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (nif: string, password: string, name: string) => Promise<void>;
  biometricLogin: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock GraphQL mutations - replace with your actual mutations
const SIGN_IN_MUTATION = gql`
  mutation SignIn($input: UserSignInInput!) {
    signIn(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

const SIGN_UP_MUTATION = gql`
  mutation SignUp($input: UserSignUpInput!) {
    signUp(input: $input) {
      success
      message
    }
  }
`;

const GET_USER_QUERY = gql`
  query GetUser {
    currentUser {
      id
      email
      name
    }
  }
`;

// GraphQL mutation for biometric authentication
const BIOMETRIC_AUTH_MUTATION = gql`
  mutation BiometricAuth($input: UserSignInWithBiometricInput!) {
    signInWithBiometric(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  // Check if the user is authenticated
  const isAuthenticated = !!user;

  // Validate token and get user data
  const validateToken = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await client.query({
        query: GET_USER_QUERY,
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      });

      if (response.data.currentUser) {
        await storeUserData(response.data.currentUser);
        const deviceData = await getDeviceData();
        await storeDeviceMetadata({
          hasBiometricEnabled: deviceData.isBiometricAvailable,
          userNif: response.data.currentUser.nif,
        });
        setUser(response.data.currentUser);
      } else {
        // Token is invalid or expired
        await clearAuthData();
        setUser(null);
      }
    } catch (error) {
      console.error("Error validating token:", error);
      // Clear auth data on error
      await clearAuthData();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Load user data on mount
  useEffect(() => {
    validateToken();
  }, []);

  // Handle routing based on authentication state
  useEffect(() => {
    if (isLoading) return;

    // Check if we're in an auth route by checking the first segment
    const firstSegment = segments[0];
    const inAuthGroup = firstSegment === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated and not in auth group
      router.replace("/(auth)/welcome" as any);
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated and in auth group
      router.replace("/(tabs)" as any);
    }
  }, [isAuthenticated, segments, isLoading]);

  // Login function
  const login = async (nif: string, pin: string) => {
    try {
      console.log("login", nif, pin);
      setIsLoading(true);

      const response = await client.mutate({
        mutation: SIGN_IN_MUTATION,
        variables: { input: { nif, password: pin } },
      });

      const { accessToken, refreshToken } = response.data.signIn;

      // Store tokens and user data
      await storeAccessToken(accessToken);
      await storeRefreshToken(refreshToken);

      const usrResp = await client.query({
        query: GET_USER_QUERY,
        context: {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        },
      });

      const deviceData = await getDeviceData();
      await storeUserData(usrResp.data.currentUser);
      await storeDeviceMetadata({
        hasBiometricEnabled: deviceData.isBiometricAvailable,
        userNif: usrResp.data.currentUser.nif,
      });
      // Update state
      setUser(usrResp.data.currentUser);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const biometricLogin = async (): Promise<void> => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();

    if (!compatible || !enrolled) {
      console.warn("Biometric authentication not available");
      return;
    }

    // First, authenticate with device biometrics
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to access your account",
      fallbackLabel: "Use passcode",
      disableDeviceFallback: false,
    });

    if (!result.success) {
      return;
    }

    // Get current device data
    const deviceData = await getDeviceData();

    // After successful biometric authentication, get tokens from backend
    const response = await client.mutate({
      mutation: BIOMETRIC_AUTH_MUTATION,
      variables: {
        input: {
          deviceId: deviceData.deviceId,
          deviceName: deviceData.deviceName,
          deviceType: deviceData.deviceType,
          biometricType: deviceData.biometricType,
        },
      },
    });

    const { accessToken, refreshToken } = response.data.signInWithBiometric;

    const usrResp = await client.query({
      query: GET_USER_QUERY,
      context: {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
    });

    // Store the tokens and user data
    await storeAccessToken(accessToken);
    await storeRefreshToken(refreshToken);
    await storeUserData(usrResp.data.currentUser);
    setUser(usrResp.data.currentUser);
  };

  // Register function
  const register = async (nif: string, pin: string, name: string) => {
    const deviceData = await getDeviceData();

    try {
      setIsLoading(true);

      const response = await client.mutate({
        mutation: SIGN_UP_MUTATION,
        variables: {
          input: {
            nif,
            password: pin,
            name,
            isMobile: true,
            isAdmin: false,
            deviceId: deviceData.deviceId,
            deviceName: deviceData.deviceName,
            deviceType: deviceData.deviceType,
            modelName: deviceData.modelName,
            biometricType: deviceData.biometricType,
          },
        },
      });

      if (!response.data.signUp.success) {
        throw new Error(response.data.signUp.message);
      }

      // After successful registration, sign in the user
      await login(nif, pin);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);

      // Clear auth data
      await clearAuthData();

      // Update state
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Provide the auth context
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        register,
        biometricLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
