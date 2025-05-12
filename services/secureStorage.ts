import * as SecureStore from "expo-secure-store";

// Keys for storing authentication data
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_DATA_KEY = "user_data";

// Interface for user data
export interface UserData {
  id: string;
  nif: string;
  email: string;
  name: string;
  role: string;
  phoneNumber: string;
  // Add other user properties as needed
}

// Store access token
export const storeAccessToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  } catch (error) {
    console.error("Error storing access token:", error);
    throw error;
  }
};

// Get access token
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
};

// Store refresh token
export const storeRefreshToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error("Error storing refresh token:", error);
    throw error;
  }
};

// Get refresh token
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Error getting refresh token:", error);
    return null;
  }
};

// Store user data
export const storeUserData = async (userData: UserData): Promise<void> => {
  try {
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error("Error storing user data:", error);
    throw error;
  }
};

// Get user data
export const getUserData = async (): Promise<UserData | null> => {
  try {
    const userDataString = await SecureStore.getItemAsync(USER_DATA_KEY);
    if (userDataString) {
      return JSON.parse(userDataString) as UserData;
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

// Clear all authentication data
export const clearAuthData = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_DATA_KEY);
  } catch (error) {
    console.error("Error clearing auth data:", error);
    throw error;
  }
};
