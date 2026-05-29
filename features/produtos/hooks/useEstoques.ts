import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

// Definindo a interface baseada nos campos que estamos usando
export interface Produto {
    id: string;
    nome: string;
    categoria: string;
    preco: number;
    qtd: number;
    validade: string;
    descricao: string;
    imagem?: string;
}

export function useEstoque() {
    return useQuery<Produto[]>({
        queryKey: ["produtos"],
        queryFn: async () => {
            const { data } = await api.get("/estoque");
            return data;
        },
        staleTime: 1000 * 60 * 5, // Cache por 5 minutos
    });
}