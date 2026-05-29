import api from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";

export function useDeleteProduto() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/estoque/${id}`);
            console.log("Exclusão:", response.data);
            return response.data;
        },
        onSuccess: (_, id) => {
            // Invalida a lista geral e o item específico que foi removido
            queryClient.invalidateQueries({ queryKey: ["produtos"] });
            queryClient.invalidateQueries({ queryKey: ["produto", id] });
        
            Alert.alert("Sucesso", "Produto excluído com sucesso!");
            router.back();
        }, 
        onError: (error: any) => {
            const message = error.response?.data?.message || "Erro ao excluir produto";
            Alert.alert("Erro", message);
        }
    });
}