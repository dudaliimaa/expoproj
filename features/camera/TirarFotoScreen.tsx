import {
  CameraCapturedPicture,
  CameraPictureOptions,
  CameraView,
  useCameraPermissions
} from "expo-camera";
import * as Location from "expo-location";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import React, { useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text
} from "react-native";

type CameraViewRef = React.ComponentRef<typeof CameraView>;

interface ChildProps {
  setURI: (arquivo: string) => void;
  setBase64: (base64: string) => void;
  setLocation: (location: { latitude: number; longitude: number; altitude: number | null; precisao: number | null }) => void;
}

const TirarFoto: React.FC<ChildProps> = ({ setURI, setBase64, setLocation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraViewRef>(null);

  async function tirarFoto() {
    if (cameraRef.current) {
      try {
        const hasServicesEnabled = await Location.hasServicesEnabledAsync();
        if (!hasServicesEnabled) {
          Alert.alert("GPS Desativado", "Ative o GPS para registrar a localização.");
          return;
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permissão negada", "Precisamos da sua localização.");
          return;
        }

        const options: CameraPictureOptions = { quality: 0, base64: true };
        const photo: CameraCapturedPicture = await cameraRef.current.takePictureAsync(options);
        const currentPosition = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });

        setURI(photo.uri);
        setBase64(photo.base64 || "Não gerado");
        setLocation({
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
          altitude: currentPosition.coords.altitude,
          precisao: currentPosition.coords.accuracy,
        });

        Alert.alert("Sucesso!", "Foto e localização registradas.");
      } catch (error) {
        Alert.alert("Erro", "Não foi possível capturar os dados.");
      }
    }
  }

  if (!permission) return <ActivityIndicator />;

  if (!permission.granted) {
    return (
      <ThemedView style={styles.containerCenter}>
        <ThemedText style={styles.titlePermission}>Câmera Desabilitada</ThemedText>
        <Pressable style={styles.botao} onPress={requestPermission}>
          <Text style={styles.textoBotao}>Permitir Acesso</Text>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.cameraContainerWrapper}>
      <ThemedView style={styles.cameraContainer}>
        <CameraView style={{ flex: 1 }} facing="back" ref={cameraRef} />
      </ThemedView>
      <Pressable style={styles.botao} onPress={tirarFoto}>
        <Text style={styles.textoBotao}>Tirar Foto</Text>
      </Pressable>
    </ThemedView>
  );
};

export default TirarFoto;

const styles = StyleSheet.create({
  containerCenter: { flex: 1, justifyContent: "center", alignItems: "center", padding: 10 },
  titlePermission: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  cameraContainerWrapper: { width: "100%", marginBottom: 10 },
  cameraContainer: {
    height: 150, // Ajustado para ficar compacto
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  botao: {
    height: 40, // Ajustado para ser compacto
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#27ae60", // Cor do seu projeto
    borderRadius: 5,
  },
  textoBotao: { fontSize: 14, color: "#fff", fontWeight: "600" },
});