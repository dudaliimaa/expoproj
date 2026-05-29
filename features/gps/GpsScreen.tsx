import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import * as Location from "expo-location";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text } from "react-native";

interface LocationState {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

export default function GpsScreen() {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getDeviceLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erro", "Permissão de localização negada.");
        return;
      }
      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
        accuracy: currentPosition.coords.accuracy,
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter a localização.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {loading && <ActivityIndicator size="small" color="#27ae60" />}

      {location && !loading && (
        <ThemedView style={styles.card}>
          <ThemedText style={styles.label}>Lat: <ThemedText style={styles.value}>{location.latitude.toFixed(4)}</ThemedText></ThemedText>
          <ThemedText style={styles.label}>Long: <ThemedText style={styles.value}>{location.longitude.toFixed(4)}</ThemedText></ThemedText>
          <ThemedText style={styles.label}>Prec: <ThemedText style={styles.value}>{location.accuracy?.toFixed(0)}m</ThemedText></ThemedText>
        </ThemedView>
      )}

      <Pressable style={styles.botao} onPress={getDeviceLocation} disabled={loading}>
        <Text style={styles.textoBotao}>Atualizar Coordenadas</Text>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 5 },
  card: { backgroundColor: "#fff", padding: 10, borderRadius: 8, width: "100%", marginBottom: 10 },
  label: { fontSize: 12, fontWeight: "bold", color: "#333" },
  value: { fontWeight: "normal", color: "#666" },
  botao: {
    height: 40,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#27ae60",
    borderRadius: 5,
  },
  textoBotao: { fontSize: 12, color: "#fff", fontWeight: "bold" },
});