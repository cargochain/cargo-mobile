import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/shared/Button";
import { FontAwesome6 } from "@expo/vector-icons";
import { components } from "@/lib/rest-api.types";
import useSWR from "swr";
import { getAccessToken } from "@/services/secureStorage";

const fetcher = async (url: string) => {
  const token = await getAccessToken();
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export default function UploadPhotosScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ shipmentUuid: string }>();
  const navigation = useNavigation();
  const [attachmentStage, setAttachmentStage] = useState("LOADING");
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<
    {
      uri: string;
      fileName: string;
      mimeType: string;
    }[]
  >([]);
  const [selectedImageIndexes, setSelectedImageIndexes] = useState<number[]>(
    []
  );

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const {
    data: shipment,
    error,
    isLoading,
  } = useSWR<components["schemas"]["Shipment"]>(
    `${process.env.EXPO_PUBLIC_API_URL}/api/v1/shipments/${params.shipmentUuid}/`,
    fetcher
  );

  const {
    data: attachments,
    error: attachmentsError,
    isLoading: attachmentsLoading,
    mutate: mutateAttachments,
  } = useSWR<components["schemas"]["ListAttachment"][]>(
    `${process.env.EXPO_PUBLIC_API_URL}/api/v1/shipments/${params.shipmentUuid}/attachments/`,
    fetcher
  );

  if (isLoading || attachmentsLoading) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <ThemedText style={styles.loadingText}>{t("Loading...")}</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (error || attachmentsError) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>
            {t("Error loading shipment details")}
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (!shipment) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>
            {t("Shipment not found")}
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const pickImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        t("Permission Required"),
        t("Permission to access media library is required!")
      );
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset, index) => ({
        uri: asset.uri,
        fileName: asset.fileName || `image_${index}_${Date.now()}.jpg`,
        mimeType: asset.mimeType || "image/jpeg",
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const uploadImages = async () => {
    if (images.length === 0) {
      Alert.alert(
        t("No Images"),
        t("Please select at least one image to upload.")
      );
      return;
    }

    setIsUploading(true);

    try {
      const token = await getAccessToken();

      // Upload each image individually using multipart form data
      for (const image of images) {
        const formData = new FormData();

        // Create file object from image uri
        const fileInfo = {
          uri: image.uri,
          name: image.fileName,
          type: image.mimeType,
        };

        formData.append("attachment_file", fileInfo as any);
        formData.append("attachment_stage", attachmentStage);
        formData.append("shipment", shipment.uuid);
        formData.append("attachment_media_type", "PHOTO");

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/v1/shipments/${params.shipmentUuid}/attachments/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Upload failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Upload successful:", data);
      }

      // Refresh attachments data after all uploads are complete
      await mutateAttachments();

      setImages([]); // Clear images after successful upload
      Alert.alert(t("Success"), t("Images uploaded successfully!"), [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert(
        t("Upload Failed"),
        t("Failed to upload images. Please try again.")
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageLongPress = (index: number) => {
    setSelectedImageIndexes((prevIndexes) => {
      if (prevIndexes.includes(index)) {
        return prevIndexes.filter((i) => i !== index);
      }
      return [...prevIndexes, index];
    });
  };

  const handleImagePress = (index: number) => {
    if (selectedImageIndexes.length > 0) {
      handleImageLongPress(index);
    }
  };

  const deleteSelectedImages = () => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => !selectedImageIndexes.includes(index))
    );
    setSelectedImageIndexes([]);
  };

  const renderSelectedImages = () => {
    return images.map((image, index) => (
      <Pressable
        onPress={() => handleImagePress(index)}
        onLongPress={() => handleImageLongPress(index)}
        key={index}
        style={[
          styles.selectedImageContainer,
          selectedImageIndexes.includes(index) && styles.selectedImagePressed,
        ]}
      >
        <Image source={{ uri: image.uri }} style={styles.selectedImage} />
        {selectedImageIndexes.includes(index) && (
          <View style={styles.selectedOverlay}>
            <FontAwesome6 name="check" size={24} color={Colors.light.primary} />
          </View>
        )}
      </Pressable>
    ));
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <FontAwesome6
            name="chevron-left"
            size={16}
            color={Colors.light.primary}
          />
          <ThemedText type="default">{t("common.back")}</ThemedText>
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <View>
            <Text style={styles.headerTitleLabel}>CMR</Text>
            <Text style={styles.headerTitleValue}>{shipment.cmr_code}</Text>
          </View>
          <View>
            <Text style={styles.headerTitleLabel}>SHIPPER</Text>
            <Text style={styles.headerTitleValue}>{shipment.user.name}</Text>
          </View>
          <View>
            <Text style={styles.headerTitleLabel}>BUYER</Text>
            <Text style={styles.headerTitleValue}>{shipment.company.name}</Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.container}>
        {/* Radio buttons for LOADING/UNLOADING */}
        <View style={styles.radioContainer}>
          <Text style={styles.radioTitle}>{t("common.attachmentStage")}</Text>
          <View style={styles.radioOptions}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setAttachmentStage("LOADING")}
            >
              <View style={styles.radioButton}>
                {attachmentStage === "LOADING" && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
              <Text style={styles.radioLabel}>LOADING</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setAttachmentStage("UNLOADING")}
            >
              <View style={styles.radioButton}>
                {attachmentStage === "UNLOADING" && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
              <Text style={styles.radioLabel}>UNLOADING</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Select Photos Button */}
        <View style={styles.selectPhotosContainer}>
          <TouchableOpacity
            onPress={pickImage}
            style={styles.selectPhotosButton}
            disabled={isUploading}
          >
            <FontAwesome6
              name="images"
              size={18}
              color={
                isUploading ? Colors.light.text + "80" : Colors.light.white
              }
            />
            <Text
              style={[
                styles.selectPhotosButtonText,
                isUploading && styles.disabledText,
              ]}
            >
              {t("common.selectPhotos")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Images Grid */}
        <View style={styles.imagesContainer}>
          {images.length > 0 && (
            <>
              <View style={styles.imagesHeader}>
                <Text style={styles.imagesTitle}>
                  {t("Selected Images")} ({images.length})
                </Text>
                {selectedImageIndexes.length > 0 && (
                  <TouchableOpacity
                    onPress={deleteSelectedImages}
                    style={styles.deleteButton}
                  >
                    <FontAwesome6
                      name="trash"
                      size={16}
                      color={Colors.light.error}
                    />
                    <Text style={styles.deleteButtonText}>
                      {t("Delete Selected")}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.imagesGrid}>{renderSelectedImages()}</View>
            </>
          )}
        </View>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <Button
          title={isUploading ? t("Uploading...") : t("Upload Images")}
          onPress={uploadImages}
          variant="primary"
          size="large"
          loading={isUploading}
          disabled={isUploading || images.length === 0}
        >
          <FontAwesome6
            name="arrow-right"
            size={18}
            color={Colors.light.white}
          />
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.light.white,
    paddingTop: Platform.select({
      android: 40,
      default: 0,
    }),
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: `${Colors.light.primary}16`,
    gap: 16,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  headerTitleLabel: {
    fontSize: 11,
    color: Colors.light.text,
  },
  headerTitleValue: {
    fontSize: 16,
    color: Colors.light.primary,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.secondary,
    padding: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  radioContainer: {
    backgroundColor: Colors.light.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  radioTitle: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: "SuisseMedium",
    marginBottom: 12,
  },
  radioOptions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.text,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.primary,
  },
  radioLabel: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: "SuisseMedium",
  },
  selectPhotosContainer: {
    marginBottom: 16,
  },
  selectPhotosButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.light.info,
    padding: 16,
    borderRadius: 12,
  },
  selectPhotosButtonText: {
    color: Colors.light.white,
    fontSize: 16,
    fontFamily: "SuisseMedium",
  },
  imagesContainer: {
    flex: 1,
  },
  imagesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  imagesTitle: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: "SuisseBold",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  deleteButtonText: {
    fontSize: 14,
    color: Colors.light.error,
    fontFamily: "SuisseMedium",
  },
  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  selectedImageContainer: {
    width: "33.33%",
    aspectRatio: 1,
    overflow: "hidden",
    padding: 1,
  },
  selectedImagePressed: {
    borderWidth: 4,
    borderColor: Colors.light.primary,
  },
  selectedImage: {
    width: "100%",
    height: "100%",
  },
  selectedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: Colors.light.white,
    borderTopWidth: 1,
    borderTopColor: `${Colors.light.primary}33`,
  },
  disabledText: {
    color: Colors.light.text + "80",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.error,
    textAlign: "center",
  },
});
