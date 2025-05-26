import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";
import { gql } from "@apollo/client";
import * as Device from "expo-device";

// Keys for storing authentication data
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_DATA_KEY = "user_data";
const DEVICE_DATA_KEY = "device_data";
const DEVICE_METADATA_KEY = "device_metadata";

// Security options
const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: Platform.select({
    ios: SecureStore.WHEN_UNLOCKED,
    android: undefined,
  }),
};

// Interface for device data
export interface DeviceData {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  osVersion: string;
  brand: string;
  modelName: string;
  isBiometricAvailable: boolean;
  biometricType: string;
}

// Get device information
export const getDeviceData = async (): Promise<DeviceData> => {
  const [deviceId, deviceName, deviceType, osVersion, brand, modelName] =
    await Promise.all([
      Device.deviceName,
      Device.deviceName,
      Device.deviceType,
      Device.osVersion,
      Device.brand,
      Device.modelName,
    ]);

  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  const supportedTypes =
    await LocalAuthentication.supportedAuthenticationTypesAsync();

  const biometricType = supportedTypes.includes(
    LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
  )
    ? "face"
    : supportedTypes.includes(
        LocalAuthentication.AuthenticationType.FINGERPRINT
      )
    ? "fingerprint"
    : "none";

  return {
    deviceId: deviceId?.toString() || "unknown",
    deviceName: deviceName?.toString() || "unknown",
    deviceType: deviceType?.toString() || "unknown",
    osVersion: osVersion?.toString() || "unknown",
    brand: brand?.toString() || "unknown",
    modelName: modelName?.toString() || "unknown",
    isBiometricAvailable: compatible && enrolled,
    biometricType,
  };
};

// Store device data
export const storeDeviceData = async (
  deviceData: DeviceData
): Promise<void> => {
  try {
    await SecureStore.setItemAsync(
      DEVICE_DATA_KEY,
      JSON.stringify(deviceData),
      SECURE_STORE_OPTIONS
    );
  } catch (error) {
    console.error("Error storing device data:", error);
    throw error;
  }
};

// Get stored device data
export const getStoredDeviceData = async (): Promise<DeviceData | null> => {
  try {
    const deviceDataString = await SecureStore.getItemAsync(
      DEVICE_DATA_KEY,
      SECURE_STORE_OPTIONS
    );
    if (deviceDataString) {
      return JSON.parse(deviceDataString) as DeviceData;
    }
    return null;
  } catch (error) {
    console.error("Error getting device data:", error);
    return null;
  }
};

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

// Check if biometric authentication is available
export const isBiometricAvailable = async (): Promise<boolean> => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return compatible && enrolled;
};

// Store access token
export const storeAccessToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(
      ACCESS_TOKEN_KEY,
      token,
      SECURE_STORE_OPTIONS
    );
  } catch (error) {
    console.error("Error storing access token:", error);
    throw error;
  }
};

// Get access token
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(
      ACCESS_TOKEN_KEY,
      SECURE_STORE_OPTIONS
    );
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
};

// Store refresh token
export const storeRefreshToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(
      REFRESH_TOKEN_KEY,
      token,
      SECURE_STORE_OPTIONS
    );
  } catch (error) {
    console.error("Error storing refresh token:", error);
    throw error;
  }
};

// Get refresh token
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(
      REFRESH_TOKEN_KEY,
      SECURE_STORE_OPTIONS
    );
  } catch (error) {
    console.error("Error getting refresh token:", error);
    return null;
  }
};

// Store user data
export const storeUserData = async (userData: UserData): Promise<void> => {
  try {
    await SecureStore.setItemAsync(
      USER_DATA_KEY,
      JSON.stringify(userData),
      SECURE_STORE_OPTIONS
    );
  } catch (error) {
    console.error("Error storing user data:", error);
    throw error;
  }
};

// Get user data
export const getUserData = async (): Promise<UserData | null> => {
  try {
    const userDataString = await SecureStore.getItemAsync(
      USER_DATA_KEY,
      SECURE_STORE_OPTIONS
    );
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

// Interface for device metadata
export interface DeviceMetadata {
  hasBiometricEnabled: boolean;
  userNif: string;
}

// Store device metadata
export const storeDeviceMetadata = async (
  metadata: DeviceMetadata
): Promise<void> => {
  try {
    await SecureStore.setItemAsync(
      DEVICE_METADATA_KEY,
      JSON.stringify(metadata),
      SECURE_STORE_OPTIONS
    );
  } catch (error) {
    console.error("Error storing device metadata:", error);
    throw error;
  }
};

// Get device metadata
export const getDeviceMetadata = async (): Promise<DeviceMetadata | null> => {
  try {
    const metadataString = await SecureStore.getItemAsync(
      DEVICE_METADATA_KEY,
      SECURE_STORE_OPTIONS
    );
    if (metadataString) {
      return JSON.parse(metadataString) as DeviceMetadata;
    }
    return null;
  } catch (error) {
    console.error("Error getting device metadata:", error);
    return null;
  }
};
