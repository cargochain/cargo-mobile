import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/shared/Button";
import { gql, useMutation, useQuery } from "@apollo/client";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { FontAwesome6 } from "@expo/vector-icons";

const GET_DRIVER_SHIPMENT_QUERY = gql`
  query GetDriverShipment($shipmentId: ID!) {
    driverShipment(shipmentId: $shipmentId) {
      id
      trackingCode
      status
      company {
        id
        name
        nif
      }
      user {
        id
        name
        nif
      }
      files {
        id
        url
      }
    }
  }
`;

const START_DELIVERY_MUTATION = gql`
  mutation StartDelivery($shipmentId: ID!) {
    startDelivery(shipmentId: $shipmentId) {
      id
    }
  }
`;

const UPLOAD_SHIPMENT_BASE64_FILES_MUTATION = gql`
  mutation UploadShipmentBase64Files($input: UploadShipmentBase64FilesInput!) {
    uploadShipmentBase64Files(input: $input) {
      id
    }
  }
`;

export default function ShipmentDetailsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [isImageSelectorModalVisible, setIsImageSelectorModalVisible] =
    useState(false);

  // Fetch the shipment details
  const { data, loading, error } = useQuery(GET_DRIVER_SHIPMENT_QUERY, {
    variables: { shipmentId: id },
  });

  // start delivery mutation
  const [startDelivery, { loading: startDeliveryLoading }] = useMutation(
    START_DELIVERY_MUTATION,
    {
      refetchQueries: [
        {
          query: GET_DRIVER_SHIPMENT_QUERY,
          variables: { shipmentId: id },
        },
      ],
    }
  );

  // upload shipment base64 files mutation
  const [
    uploadShipmentBase64Files,
    { loading: uploadShipmentBase64FilesLoading },
  ] = useMutation(UPLOAD_SHIPMENT_BASE64_FILES_MUTATION, {
    refetchQueries: [
      { query: GET_DRIVER_SHIPMENT_QUERY, variables: { shipmentId: id } },
    ],
  });

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  if (loading) {
    return <ThemedText>{t("Loading...")}</ThemedText>;
  }

  if (error) {
    return <ThemedText>{t("Error loading shipment details")}</ThemedText>;
  }

  const shipment = data.driverShipment;

  const renderActionButton = () => {
    switch (shipment.status) {
      case "ASSIGNED":
        return (
          <Button
            title={t("Start Delivery")}
            onPress={() =>
              startDelivery({ variables: { shipmentId: shipment.id } })
            }
            loading={startDeliveryLoading}
            variant="primary"
            size="large"
          />
        );
      case "IN_TRANSIT":
        return (
          <Button
            title={t("Confirm Delivery")}
            onPress={() =>
              startDelivery({ variables: { shipmentId: shipment.id } })
            }
            loading={startDeliveryLoading}
            variant="primary"
            size="large"
          />
        );
      default:
        return null;
    }
  };

  const ImageSelectorModal = ({
    isVisible,
    onClose,
  }: {
    isVisible: boolean;
    onClose: () => void;
  }) => {
    // Image Picker
    const [images, setImages] = useState<
      {
        uri: string;
        fileName: string;
        mimeType: string;
      }[]
    >([]);

    const pickImage = async () => {
      // Request permission to access media library
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert(t("Permission to access media library is required!"));
        return;
      }

      // Launch image picker
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
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

    const deleteImage = (index: number) => {
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    // upload images
    const uploadImages = async () => {
      if (images.length === 0) {
        return;
      }

      try {
        // Convert images to base64 and build the input array
        const files = await Promise.all(
          images.map(async (image) => {
            const fileContent = await FileSystem.readAsStringAsync(image.uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            return {
              name: image.fileName,
              mimeType: image.mimeType,
              base64: fileContent,
            };
          })
        );

        // Call the GraphQL mutation
        await uploadShipmentBase64Files({
          variables: {
            input: {
              shipmentId: shipment.id,
              files,
            },
          },
        });

        alert(t("Images uploaded successfully!"));
        setImages([]); // Clear images after successful upload
        onClose(); // Close the modal
      } catch (error) {
        console.error("Upload error:", error);
        alert(t("Failed to upload images. Please try again."));
      }
    };

    const renderImages = () => {
      return images.map((image, index) => (
        <View key={index}>
          <Image source={{ uri: image.uri }} style={styles.image} />
          <TouchableOpacity onPress={() => deleteImage(index)}>
            <IconSymbol name="trash" size={24} color={Colors.light.error} />
          </TouchableOpacity>
        </View>
      ));
    };

    // render options
    const renderOptions = () => {
      if (images.length === 0) {
        return (
          <View style={styles.imageSelectorModalOptions}>
            <TouchableOpacity
              onPress={pickImage}
              style={styles.addPhotosButton}
            >
              <FontAwesome6 name="images" size={18} color={Colors.light.info} />
              <Text style={styles.addPhotosButtonText}>
                {t("common.selectPhotos")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.addPhotosButton}>
              <Text style={styles.addPhotosButtonText}>{t("Cancel")}</Text>
            </TouchableOpacity>
          </View>
        );
      }

      return (
        <View style={styles.imageSelectorModalOptions}>
          <Button
            title={t("Continue")}
            onPress={uploadImages}
            variant="primary"
            size="medium"
          />
          <Button
            title={t("Cancel")}
            onPress={onClose}
            variant="outline"
            size="medium"
          />
        </View>
      );
    };

    return (
      <Modal visible={isVisible} onRequestClose={onClose}>
        <SafeAreaView style={styles.imageSelectorModalWrapper}>
          <View style={styles.imageSelectorModalImages}>{renderImages()}</View>
          {renderOptions()}
        </SafeAreaView>
      </Modal>
    );
  };

  console.log(shipment.files);

  return (
    <SafeAreaView style={styles.wrapper}>
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
          <ThemedText type="defaultSemiBold">{t("common.back")}</ThemedText>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitleLabel}>Código de Rastreio:</Text>
          <Text style={styles.headerTitleValue}>{shipment.trackingCode}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.photos}>
          <View style={styles.photosHeader}>
            <Text style={styles.photosHeaderText}>{t("Photos")}</Text>
            <TouchableOpacity
              onPress={() => setIsImageSelectorModalVisible(true)}
              style={styles.addPhotosButton}
            >
              <FontAwesome6 name="images" size={18} color={Colors.light.info} />
              <Text style={styles.addPhotosButtonText}>
                {t("common.selectPhotos")}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.photosBody}>
            {shipment.files.map((file: any, index: number) => (
              <View style={styles.photoItem} key={index}>
                <Image
                  source={{ uri: file.url }}
                  style={styles.photoItemImage}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomContainer}>{renderActionButton()}</View>
      </View>
      <ImageSelectorModal
        isVisible={isImageSelectorModalVisible}
        onClose={() => setIsImageSelectorModalVisible(false)}
      />
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
    gap: 1,
  },
  headerTitleLabel: {
    fontSize: 14,
    color: `${Colors.light.text}90`,
  },
  headerTitleValue: {
    fontSize: 18,
    color: Colors.light.text,
    fontFamily: "SuisseBold",
    textTransform: "uppercase",
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    backgroundColor: Colors.light.secondary,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButtonText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontFamily: "SuisseIntl-Medium",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: "SuisseMedium",
  },
  statusValue: {
    fontSize: 18,
    color: Colors.light.primary,
    fontFamily: "SuisseBold",
  },
  photos: {
    flex: 1,
  },
  photosHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    marginBottom: 16,
  },
  photosHeaderText: {
    fontSize: 18,
    color: Colors.light.text,
    fontFamily: "SuisseBold",
  },
  photosBody: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  photosButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  photosButtonText: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: "SuisseMedium",
  },
  photoItem: {
    width: "32.5%", // 3 columns with some spacing
    aspectRatio: 1, // Square images
    marginBottom: 2,
    overflow: "hidden",
    borderRadius: 8,
  },
  photoItemImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  actionButton: {
    color: Colors.light.info,
    fontSize: 16,
    fontFamily: "SuisseIntl-Medium",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.light.white,
    borderTopWidth: 1,
    borderTopColor: `${Colors.light.primary}33`,
  },
  addPhotosButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addPhotosButtonText: {
    color: Colors.light.info,
    fontSize: 16,
  },
  statusText: {
    fontSize: 16,
    color: Colors.light.primary,
    fontFamily: "Suisse",
  },
  imageSelectorModalWrapper: {
    flex: 1,
    backgroundColor: Colors.light.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  imageSelectorModalOptions: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  imageSelectorModalImages: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    padding: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: `${Colors.light.primary}33`,
  },
});
