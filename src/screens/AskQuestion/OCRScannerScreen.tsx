import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { recognizeImage } from "../../services/ocr/tesseractService";

export default function OCRScannerScreen({ navigation }: any) {
  const [scanning, setScanning] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  async function requestPermissions() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera permission is needed to scan questions"
      );
      return false;
    }
    return true;
  }

  async function handleCamera() {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setScanning(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        await processImage(uri);
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Failed to capture image");
    } finally {
      setScanning(false);
    }
  }

  async function handleGallery() {
    setScanning(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        await processImage(uri);
      }
    } catch (error) {
      console.error("Gallery error:", error);
      Alert.alert("Error", "Failed to pick image");
    } finally {
      setScanning(false);
    }
  }

  async function processImage(uri: string) {
    try {
      Alert.alert("Processing", "Extracting text from image...");
      const text = await recognizeImage(uri);

      if (text && text.trim()) {
        navigation.navigate("Ask", { scannedText: text, imageUri: uri });
      } else {
        Alert.alert("No Text Found", "Could not extract text from the image");
      }
    } catch (error) {
      console.error("OCR processing error:", error);
      Alert.alert("Error", "Failed to process image");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OCR Scanner</Text>
      <Text style={styles.description}>
        Scan handwritten or printed questions using your camera
      </Text>

      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>📷</Text>
          <Text style={styles.placeholderSubtext}>No image selected</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title={scanning ? "Processing..." : "Take Photo"}
          onPress={handleCamera}
          disabled={scanning}
        />
      </View>

      <View style={styles.buttonSpacing} />

      <View style={styles.buttonContainer}>
        <Button
          title="Choose from Gallery"
          onPress={handleGallery}
          disabled={scanning}
        />
      </View>

      <View style={styles.buttonSpacing} />

      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  imageContainer: {
    flex: 1,
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  placeholder: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 64,
    color: "#999",
  },
  placeholderSubtext: {
    fontSize: 16,
    color: "#999",
    marginTop: 8,
  },
  buttonContainer: {
    width: "100%",
  },
  buttonSpacing: {
    height: 12,
  },
});
