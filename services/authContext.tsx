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
import { setNavigationCallback, apiGet } from "./apiClient";

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}`;
const TOKEN_URL = `${API_URL}/api/v1/token/`;
const USER_URL = `${API_URL}/api/v1/users/me/`;

// Define the shape of the auth context
interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// REST API functions
const loginUser = async (
  email: string,
  password: string
): Promise<{ access: string; refresh: string }> => {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: email.toLowerCase().trim(),
      password,
    }),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }

  return response.json();
};

const registerUser = async (
  email: string,
  password: string,
  name: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/api/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      name,
    }),
  });

  if (!response.ok) {
    throw new Error(`Registration failed: ${response.status}`);
  }
};

const getCurrentUser = async (accessToken: string): Promise<UserData> => {
  const response = await apiGet(USER_URL);

  if (!response.ok) {
    throw new Error(`Failed to get user data: ${response.status}`);
  }

  return response.json();
};

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  // Check if the user is authenticated
  const isAuthenticated = !!user;

  // Set up navigation callback for API client
  useEffect(() => {
    const navigateToLogin = () => {
      console.log("Token refresh failed, navigating to login");
      setUser(null);
      router.replace("/(auth)/welcome" as any);
    };

    setNavigationCallback(navigateToLogin);

    // Cleanup on unmount
    return () => {
      setNavigationCallback(null);
    };
  }, [router]);

  // Validate token and get user data
  const validateToken = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const userData = await getCurrentUser(token);
      await storeUserData(userData);
      const deviceData = await getDeviceData();
      await storeDeviceMetadata({
        hasBiometricEnabled: deviceData.isBiometricAvailable,
        userNif: userData.nif,
      });
      setUser(userData);
    } catch {
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
  }, [isAuthenticated, segments, isLoading, router]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const tokenData = await loginUser(email, password);

      // Store tokens
      await storeAccessToken(tokenData.access);
      await storeRefreshToken(tokenData.refresh);

      // Get user data
      const userData = await getCurrentUser(tokenData.access);
      await storeUserData(userData);

      // Update state
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      await registerUser(email, password, name);
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
