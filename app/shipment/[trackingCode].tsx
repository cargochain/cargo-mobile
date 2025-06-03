import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  Platform,
  Pressable,
  FlatList,
  ActivityIndicator,
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
import { FontAwesome6 } from "@expo/vector-icons";
import {
  FinishDeliveryMutation,
  FinishDeliveryMutationVariables,
  GetShipmentQuery,
  GetShipmentQueryVariables,
  CompleteDeliveryMutation,
  CompleteDeliveryMutationVariables,
  ShipmentStatus,
  StartDeliveryMutation,
  StartDeliveryMutationVariables,
  UnloadShipmentMutation,
  UnloadShipmentMutationVariables,
} from "@/services/generated/graphql";

const GET_SHIPMENT_QUERY = gql`
  query GetShipment($trackingCode: String!) {
    shipment(trackingCode: $trackingCode) {
      id
      trackingCode
      status
      company {
        id
        name
      }
      user {
        id
        name
        email
      }
      files {
        id
        url
      }
    }
  }
`;

const START_DELIVERY_MUTATION = gql`
  mutation StartDelivery($trackingCode: String!) {
    startDelivery(trackingCode: $trackingCode) {
      trackingCode
    }
  }
`;

const FINISH_DELIVERY_MUTATION = gql`
  mutation FinishDelivery($trackingCode: String!) {
    finishDelivery(trackingCode: $trackingCode) {
      trackingCode
    }
  }
`;

const UNLOAD_SHIPMENT_MUTATION = gql`
  mutation UnloadShipment($trackingCode: String!) {
    unloadShipment(trackingCode: $trackingCode) {
      trackingCode
    }
  }
`;

const COMPLETE_DELIVERY_MUTATION = gql`
  mutation CompleteDelivery($trackingCode: String!) {
    completeDelivery(trackingCode: $trackingCode) {
      trackingCode
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
  const { trackingCode } = useLocalSearchParams();
  const navigation = useNavigation();
  const [isImageSelectorModalVisible, setIsImageSelectorModalVisible] =
    useState(false);

  // Fetch the shipment details
  const { data, loading, error } = useQuery<
    GetShipmentQuery,
    GetShipmentQueryVariables
  >(GET_SHIPMENT_QUERY, {
    variables: { trackingCode: trackingCode as string },
  });

  // start delivery mutation
  const [startDelivery, { loading: startDeliveryLoading }] = useMutation<
    StartDeliveryMutation,
    StartDeliveryMutationVariables
  >(START_DELIVERY_MUTATION, {
    refetchQueries: [
      {
        query: GET_SHIPMENT_QUERY,
        variables: { trackingCode },
      },
    ],
  });

  // finish delivery mutation
  const [finishDelivery, { loading: finishDeliveryLoading }] = useMutation<
    FinishDeliveryMutation,
    FinishDeliveryMutationVariables
  >(FINISH_DELIVERY_MUTATION, {
    refetchQueries: [
      { query: GET_SHIPMENT_QUERY, variables: { trackingCode } },
    ],
  });

  // unload delivery mutation
  const [unloadShipment, { loading: unloadShipmentLoading }] = useMutation<
    UnloadShipmentMutation,
    UnloadShipmentMutationVariables
  >(UNLOAD_SHIPMENT_MUTATION, {
    refetchQueries: [
      { query: GET_SHIPMENT_QUERY, variables: { trackingCode } },
    ],
  });

  // complete delivery mutation
  const [completeDelivery, { loading: completeDeliveryLoading }] = useMutation<
    CompleteDeliveryMutation,
    CompleteDeliveryMutationVariables
  >(COMPLETE_DELIVERY_MUTATION, {
    refetchQueries: [
      { query: GET_SHIPMENT_QUERY, variables: { trackingCode } },
    ],
  });

  // upload shipment base64 files mutation
  const [
    uploadShipmentBase64Files,
    { loading: uploadShipmentBase64FilesLoading },
  ] = useMutation(UPLOAD_SHIPMENT_BASE64_FILES_MUTATION, {
    refetchQueries: [
      { query: GET_SHIPMENT_QUERY, variables: { trackingCode } },
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

  const shipment = data?.shipment;
  if (!shipment) {
    return <ThemedText>{t("Shipment not found")}</ThemedText>;
  }

  const getShipmentStatusLabel = (status: ShipmentStatus) => {
    switch (status) {
      case ShipmentStatus.READY:
        return t("common.readyToStart");
      case ShipmentStatus.LOADING:
        return t("common.loadingShipment");
      case ShipmentStatus.IN_TRANSIT:
        return t("common.inTransit");
      case ShipmentStatus.ARRIVED:
        return t("common.arrivedAtDestination");
      case ShipmentStatus.UNLOADING:
        return t("common.unloading");
      case ShipmentStatus.DELIVERED:
        return t("common.delivered");
      default:
        return "";
    }
  };

  const renderActionButton = () => {
    switch (shipment.status) {
      case ShipmentStatus.READY:
        return (
          <Button
            title={t("common.startDelivery")}
            onPress={() =>
              startDelivery({
                variables: { trackingCode: shipment.trackingCode },
              })
            }
            loading={startDeliveryLoading}
            variant="primary"
            style={{ width: "100%" }}
            size="large"
          />
        );
      case ShipmentStatus.IN_TRANSIT:
        return (
          <Button
            title={t("common.finishDelivery")}
            onPress={() =>
              finishDelivery({
                variables: { trackingCode: shipment.trackingCode },
              })
            }
            loading={completeDeliveryLoading}
            variant="primary"
            size="large"
          />
        );
      case ShipmentStatus.ARRIVED:
        return (
          <Button
            title={t("common.unloadShipment")}
            onPress={() =>
              unloadShipment({
                variables: { trackingCode: shipment.trackingCode },
              })
            }
            loading={completeDeliveryLoading}
            variant="primary"
            size="large"
          />
        );
      case ShipmentStatus.UNLOADING:
        return (
          <Button
            title={t("common.completeDelivery")}
            onPress={() =>
              completeDelivery({
                variables: { trackingCode: shipment.trackingCode },
              })
            }
            loading={completeDeliveryLoading}
            variant="primary"
            size="large"
          />
        );
      case ShipmentStatus.DELIVERED:
        return <Text style={styles.statusText}>{t("common.delivered")}</Text>;
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

    const [selectedImageIndexes, setSelectedImageIndexes] = useState<number[]>(
      []
    );

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
        uploadShipmentBase64Files({
          variables: {
            input: {
              shipmentId: shipment.id,
              files,
            },
          },
        }).then(() => {
          alert(t("Images uploaded successfully!"));
        });

        setImages([]); // Clear images after successful upload
        onClose(); // Close the modal
      } catch (error) {
        console.error("Upload error:", error);
        alert(t("Failed to upload images. Please try again."));
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
              <FontAwesome6 name="check" size={24} color={Colors.light.white} />
            </View>
          )}
        </Pressable>
      ));
    };

    // render options
    const renderOptions = () => {
      if (selectedImageIndexes.length > 0) {
        return (
          <Button
            title={t("Delete Selected")}
            onPress={deleteSelectedImages}
            variant="secondary"
            size="medium"
          />
        );
      }
      return (
        <Button
          title={
            uploadShipmentBase64FilesLoading ? t("Uploading...") : t("Continue")
          }
          onPress={uploadImages}
          variant="primary"
          size="medium"
          loading={uploadShipmentBase64FilesLoading}
          disabled={uploadShipmentBase64FilesLoading}
        />
      );
    };

    return (
      <Modal visible={isVisible} onRequestClose={onClose}>
        <SafeAreaView style={styles.imageSelectorModalWrapper}>
          <View style={styles.imageSelectorModalOptions}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.addPhotosButton}
              disabled={uploadShipmentBase64FilesLoading}
            >
              <Text
                style={[
                  styles.addPhotosButtonText,
                  uploadShipmentBase64FilesLoading && styles.disabledText,
                ]}
              >
                {t("Cancel")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={pickImage}
              style={styles.addPhotosButton}
              disabled={uploadShipmentBase64FilesLoading}
            >
              <FontAwesome6
                name="images"
                size={18}
                color={
                  uploadShipmentBase64FilesLoading
                    ? Colors.light.text + "80"
                    : Colors.light.info
                }
              />
              <Text
                style={[
                  styles.addPhotosButtonText,
                  uploadShipmentBase64FilesLoading && styles.disabledText,
                ]}
              >
                {t("common.selectPhotos")}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.imageSelectorModalImages}>
            {images.length > 0 && renderSelectedImages()}
          </View>
          <View style={styles.imageSelectorModalExtraOptions}>
            {images.length > 0 && renderOptions()}
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      {uploadShipmentBase64FilesLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.light.white} />
          <ThemedText style={styles.loadingText}>
            {t("Uploading files...")}
          </ThemedText>
        </View>
      )}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
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
          <Text style={styles.headerTitleLabel}>
            {t("common.trackingCode")}:
          </Text>
          <Text style={styles.headerTitleValue}>{shipment.trackingCode}</Text>
          <Text
            style={[
              styles.headerTitleLabel,
              {
                color: Colors.light.text,
                fontWeight: "600",
                marginTop: 10,
                fontSize: 16,
                fontStyle: "italic",
              },
            ]}
          >
            {getShipmentStatusLabel(shipment.status)}
          </Text>
        </View>
        {(shipment.status === ShipmentStatus.LOADING ||
          shipment.status === ShipmentStatus.UNLOADING) && (
          <TouchableOpacity
            onPress={() => setIsImageSelectorModalVisible(true)}
            style={styles.addPhotosButton}
          >
            <FontAwesome6 name="plus" size={18} color={Colors.light.info} />
            <Text style={styles.addPhotosButtonText}>
              {t("common.addPhotos")}
            </Text>
          </TouchableOpacity>
        )}
        {shipment.status === ShipmentStatus.DELIVERED && (
          <FontAwesome6 name="check" size={18} color={Colors.light.success} />
        )}
      </View>
      <View style={styles.container}>
        <View style={styles.photos}>
          <FlatList
            data={shipment.files}
            renderItem={({ item }) => (
              <View style={styles.photoItem} key={item.id}>
                <Image
                  source={{ uri: item.url }}
                  style={styles.photoItemImage}
                />
              </View>
            )}
            numColumns={3}
            keyExtractor={(item) => item.id}
          />
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
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
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
    color: Colors.light.primary,
    textTransform: "uppercase",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.secondary,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
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
    gap: 1,
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
    width: "33.33%", // 3 columns with some spacing
    aspectRatio: 1, // Square images
    overflow: "hidden",
    padding: 1,
  },
  photoItemImage: {
    width: "100%",
    height: "100%",
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
    textAlign: "center",
  },
  imageSelectorModalWrapper: {
    flex: 1,
    backgroundColor: Colors.light.white,
    gap: 16,
  },
  imageSelectorModalOptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 16,
  },
  imageSelectorModalExtraOptions: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 16,
  },
  imageSelectorModalImages: {
    flex: 1,
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
    borderColor: Colors.light.white,
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
  disabledText: {
    color: Colors.light.text + "80",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    color: Colors.light.white,
    marginTop: 12,
    fontSize: 16,
  },
});
