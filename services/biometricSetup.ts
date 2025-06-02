import { storeDeviceMetadata, DeviceMetadata } from "./secureStorage";
import * as LocalAuthentication from "expo-local-authentication";

// Query to check if user has biometric enabled
// const CHECK_BIOMETRIC_ENABLED_QUERY = gql`
//   query CheckBiometricEnabled($nif: String!) {
//     userHasBiometricEnabled(nif: $nif)
//   }
// `;

// Mutation to enable biometric authentication
// const ENABLE_BIOMETRIC_MUTATION = gql`
//   mutation SignInWithBiometric($input: UserSignInWithBiometricInput!) {
//     signInWithBiometric(input: $input) {
//       accessToken
//       refreshToken
//     }
//   }
// `;

// export const checkBiometricSetup = async (nif: string): Promise<boolean> => {
//   try {
//     // First check if we have metadata stored locally
//     const deviceMetadata = await getDeviceMetadata();
//     if (deviceMetadata?.hasBiometricEnabled && deviceMetadata.userNif === nif) {
//       return true;
//     }

//     // If not found locally, check with backend
//     const response = await client.query({
//       query: CHECK_BIOMETRIC_ENABLED_QUERY,
//       variables: { nif },
//     });

//     return response.data.userHasBiometricEnabled;
//   } catch (error) {
//     console.error("Error checking biometric setup:", error);
//     return false;
//   }
// };

export const setupBiometric = async (nif: string): Promise<boolean> => {
  try {
    // Check if device supports biometric authentication
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();

    if (!compatible || !enrolled) {
      throw new Error("Biometric authentication not available on this device");
    }

    // Authenticate with device biometrics first
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to enable biometric login",
      fallbackLabel: "Use passcode",
      disableDeviceFallback: false,
    });

    if (!result.success) {
      throw new Error("Biometric authentication failed");
    }

    // Call backend to enable biometric
    // const response = await client.mutate({
    //   mutation: ENABLE_BIOMETRIC_MUTATION,
    //   variables: {
    //     input: {
    //       nif,
    //       biometricType: deviceData.biometricType,
    //     },
    //   },
    // });

    // Store metadata locally
    const metadata: DeviceMetadata = {
      hasBiometricEnabled: true,
      userNif: nif,
    };
    await storeDeviceMetadata(metadata);

    return true;
  } catch (error) {
    console.error("Error setting up biometric:", error);
    return false;
  }
};
