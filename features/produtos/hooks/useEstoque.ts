// features/produtos/hooks/useEstoque.ts
import api from "@/services/api";
import { Produto } from "@/types/produto";
import { useQuery } from "@tanstack/react-query";

export function useEstoque(id?: string) {
    return useQuery<Produto | Produto[]>({
        queryKey: id ? ["produto", id] : ["estoque"],
        queryFn: async () => {
            if (id) {
                // Busca um produto específico
                const { data } = await api.get<Produto>(`/estoque/${id}`);
                return data;
            } else {
                // Busca a lista completa de estoque
                const { data } = await api.get<Produto[]>(`/estoque`);
                
                // GARANTIA: Se o backend retornar algo que não seja um array, força ser um array vazio
                // Isso evita o erro de renderização na FlatList
                return Array.isArray(data) ? data : [];
            }
        },
        staleTime: 1000 * 60 * 5,
    });
}