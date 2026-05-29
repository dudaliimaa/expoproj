import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useDeleteProduto } from "./hooks/useDeleteProduto";
import { useProduto } from "./hooks/useEstoque";

export default function ProdutoDeleteScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    
    const { mutate } = useDeleteProduto();
    const { data: produto, isLoading, error, refetch } = useProduto(id as string);

    if (isLoading) {
        return (
            <ThemedView style={estilo.pagina}>
                <ThemedText style={estilo.subtitulo}>Carregando produto...</ThemedText>
            </ThemedView>
        );
    }

    if (error || !produto) {
        return (
            <ThemedView style={estilo.pagina}>
                <ThemedText style={estilo.subtitulo}>Erro ao carregar dados.</ThemedText>
                <Pressable style={estilo.botaoCancelar} onPress={() => refetch()}>
                    <Text style={estilo.textoBotao}>Recarregar</Text>
                </Pressable>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={estilo.pagina}>
            <ThemedText type="title" style={estilo.titulo}>Excluir Produto</ThemedText>
            <ThemedText style={estilo.confirmacao}>Tem certeza que deseja apagar {produto.nome}?</ThemedText>
            
            {produto.fotoUri ? (
                <Image source={{ uri: produto.fotoUri }} style={estilo.fotoMiniatura} />
            ) : (
                <View style={[estilo.fotoMiniatura, { justifyContent: 'center', alignItems: 'center' }]}>
                    <IconSymbol size={64} name="cube.fill" color={'#ccc'} />
                </View>
            )}

            <View style={estilo.detalhes}>
                <ThemedText style={estilo.dado}>Preço: R$ {produto.preco}</ThemedText>
                <ThemedText style={estilo.dado}>Quantidade: {produto.qtd}</ThemedText>
                <ThemedText style={estilo.dado}>Categoria: {produto.categoria}</ThemedText>
                <ThemedText style={estilo.dado}>Validade: {produto.validade}</ThemedText>
                <ThemedText style={estilo.dado}>Descrição: {produto.descricao}</ThemedText>
            </View>

            <View style={estilo.botoes}>
                <Pressable style={estilo.botaoCancelar} onPress={() => router.back()}>
                    <Text style={estilo.textoBotao}>Cancelar</Text>
                </Pressable>
                <Pressable style={estilo.botaoExcluir} onPress={() => mutate(id as string)}>
                    <Text style={estilo.textoBotao}>Excluir</Text>
                </Pressable>
            </View>
        </ThemedView>
    );
}

const estilo = StyleSheet.create({
    pagina: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#121212' },
    titulo: { color: '#e67e22', marginBottom: 20, textAlign: 'center' },
    subtitulo: { color: '#fff', fontSize: 18, textAlign: 'center', marginBottom: 15 },
    confirmacao: { textAlign: 'center', color: '#fff', marginBottom: 20, fontSize: 16 },
    fotoMiniatura: { width: 250, height: 250, borderRadius: 15, alignSelf: 'center', marginBottom: 20 },
    detalhes: { marginBottom: 30, padding: 15, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10 },
    dado: { fontSize: 16, color: '#fff', marginBottom: 8 },
    botoes: { flexDirection: 'row', justifyContent: 'center', gap: 20 },
    botaoCancelar: { flex: 1, height: 50, backgroundColor: '#7f8c8d', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    botaoExcluir: { flex: 1, height: 50, backgroundColor: '#c0392b', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    textoBotao: { color: '#fff', fontWeight: 'bold' }
});