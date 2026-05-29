import api from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";

// Interface para garantir a tipagem correta dos dados do produto
interface NovoProduto {
    nome: string;
    categoria: string;
    preco: number;
    qtd: number;
    validade: string;
    descricao: string;
    imagem: string;
    coordenada?: {
        latitude: number;
        longitude: number;
        altitude: number | null;
        precisao: number | null;
    };
}

export function useCreateProduto() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (novoProduto: NovoProduto) => {
            // Rota ajustada para o seu endpoint de estoque
            const { data } = await api.post("/estoque/cadastrar", novoProduto);
            console.log("Criação de produto:", data);
            return data;
        },
        onSuccess: () => {
            // Invalida a lista de produtos para que a tela de listagem atualize
            queryClient.invalidateQueries({ queryKey: ["produtos"] });

            Alert.alert("Sucesso", "Produto cadastrado com sucesso!");
            // Redireciona de volta para a listagem (ajuste o caminho se necessário)
            router.push("/(tabs)");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Erro ao cadastrar produto";
            Alert.alert("Erro", message);
        }
    });
}