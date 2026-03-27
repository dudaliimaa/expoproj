import api from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";

export function useDeleteProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Usa a mesma lógica do update, mas com DELETE
      const response = await api.delete(`/produtos/${id}`);
      return response.data;
    },
    onSuccess: () => {
      // Isso aqui é o que faz o produto sumir da tela na hora!
      queryClient.invalidateQueries({ queryKey: ["produtos"] });

      Alert.alert("Sucesso", "Produto excluído!");
      router.replace("/(tabs)"); // Volta para a listagem
    },
    onError: () => {
      Alert.alert("Erro", "Não foi possível excluir o produto.");
    }
  });
}