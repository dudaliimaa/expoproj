import api from "../../services/api"; 
import { ThemedText } from "../../components/themed-text"; 
import { ThemedView } from "../../components/themed-view";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";

// O tipo aceita string ou string[] para bater com o useLocalSearchParams
export default function ProdutoDeleteScreen({ id }: { id: string | string[] | undefined }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Tratamos o ID aqui dentro antes de enviar para a API
  const idLimpo = Array.isArray(id) ? id[0] : id;

  const { mutate: deletar, isPending } = useMutation({
    mutationFn: async (idProduto: string) => {
      // Faz a chamada DELETE usando o ID limpo
      return await api.delete(`/produtos/${idProduto}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      Alert.alert("Sucesso", "Produto removido com sucesso!");
      router.replace("/(tabs)"); 
    },
    onError: (error: any) => {
      console.log("Erro na API:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível excluir o produto.");
    }
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.titulo}>Excluir Produto</ThemedText>
      
      {/* Exibimos o ID limpo na tela */}
      <ThemedText style={styles.subtitulo}>ID selecionado: {idLimpo}</ThemedText>

      <Pressable 
        onPress={() => idLimpo && deletar(idLimpo)} 
        disabled={isPending || !idLimpo}
        style={[styles.botao, styles.botaoDelete, (isPending || !idLimpo) && { opacity: 0.5 }]}
      >
        {isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <ThemedText style={styles.textoBotao}>Confirmar Exclusão</ThemedText>
        )}
      </Pressable>

      <Pressable onPress={() => router.back()} style={[styles.botao, styles.botaoVoltar]}>
        <ThemedText style={styles.textoBotao}>Cancelar</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  subtitulo: { fontSize: 16, marginBottom: 30, color: "#666" },
  botao: { padding: 15, borderRadius: 8, width: "100%", alignItems: "center", marginBottom: 10 },
  botaoDelete: { backgroundColor: "#FF4444" },
  botaoVoltar: { backgroundColor: "#9999FF" },
  textoBotao: { color: "white", fontWeight: "bold" },
});