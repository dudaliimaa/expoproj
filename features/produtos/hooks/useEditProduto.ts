import api from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";

// Definindo a interface para garantir segurança no seu código
interface Produto {
    id: string;
    nome: string;
    categoria: string;
    preco: number;
    qtd: number;
    validade: string;
    descricao: string;
    imagem?: string;
    coordenada?: {
        latitude: number;
        longitude: number;
        altitude: number | null;
        precisao: number | null;
    };
}

export function useEditProduto() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (produto: Produto) => {
            // Ajuste a rota se o seu backend esperar o ID na URL ou no corpo
            const response = await api.put(`/estoque/${produto.id}`, produto);
            return response.data;
        },
        onSuccess: (data, variables) => {
            // Atualiza a lista e o detalhe do produto automaticamente
            queryClient.invalidateQueries({ queryKey: ["produtos"] });
            queryClient.invalidateQueries({ queryKey: ["produto", variables.id] });
        
            Alert.alert("Sucesso", "Produto editado com sucesso!");
            router.back();
        }, 
        onError: (error: any) => {
            const message = error.response?.data?.message || "Erro ao editar produto";
            Alert.alert("Erro", message);
        }
    });
}