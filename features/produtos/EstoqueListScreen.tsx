import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useEstoque } from "./hooks/useEstoques"; 

export default function EstoqueListScreen() {
    const router = useRouter();

    const {
        data: listaProdutos,
        isLoading,
        error,
        refetch,
    } = useEstoque();

    if (isLoading) {
        return (
            <ThemedView style={estilo.pagina}>
                <ThemedText type="title" style={estilo.titulo}>Estoque</ThemedText>
                <ThemedText type="subtitle" style={estilo.subtitulo}>Carregando produtos...</ThemedText>
            </ThemedView>
        );
    }

    if (error) {
        return (
            <ThemedView style={estilo.pagina}>
                <ThemedText type="title" style={estilo.titulo}>Estoque</ThemedText>
                <ThemedText type="subtitle" style={estilo.subtitulo}>Erro ao carregar estoque.</ThemedText>
                <Pressable style={estilo.botaoRecarregar} onPress={() => refetch()}>
                    <Text style={estilo.textoBotao}>Recarregar</Text>
                </Pressable>
            </ThemedView>
        );
    }
    
    return (
        <ThemedView style={estilo.pagina}>
            <ThemedText type="title" style={estilo.titulo}>Estoque</ThemedText>
            <ThemedText type="subtitle" style={estilo.subtitulo}>Produtos disponíveis:</ThemedText>
            <FlatList
                style={estilo.lista}
                data={listaProdutos}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                    <ThemedView style={estilo.card}>
                        {item.imagem ? (
                            <Image 
                                source={{ uri: `data:image/jpeg;base64,${item.imagem}` }} 
                                style={estilo.fotoMiniatura}
                            />
                        ) : (
                            <View style={[estilo.fotoMiniatura, { justifyContent: 'center', alignItems: 'center' }]}>
                                {/* Nome de ícone alterado para um compatível */}
                                <IconSymbol size={32} name="square.stack" color={'#ccc'} />
                            </View>
                        )}
                        <View style={estilo.informacoes}>
                            <ThemedText type="defaultSemiBold" style={estilo.nome}>{item.nome}</ThemedText>
                            <ThemedText style={estilo.dado}>Preço: R$ {item.preco}</ThemedText>
                            <ThemedText style={estilo.dado}>Quantidade: {item.qtd}</ThemedText>
                            <ThemedText style={estilo.dado}>Categoria: {item.categoria}</ThemedText>
                            <ThemedText style={estilo.dado}>Validade: {item.validade}</ThemedText>
                        </View>
                        <View style={estilo.botoes}>
                            <Pressable style={estilo.botaoAcao} onPress={() => router.push(`/produto/edit/${item.id}`)}>
                                <IconSymbol size={28} name="pencil" color={'#ffffff'} />
                            </Pressable>
                            <Pressable style={estilo.botaoAcao} onPress={() => router.push(`/produto/delete/${item.id}`)}>
                                <IconSymbol size={28} name="trash" color={'#ffffff'} />
                            </Pressable>
                        </View>
                    </ThemedView>
                )}
            />
        </ThemedView>
    );
}

const estilo = StyleSheet.create({
    // ... mantive o seu estilo, apenas certifique-se que o card tenha o estilo correto
    pagina: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
    titulo: { marginBottom: 20, textAlign: "center" },
    subtitulo: { marginBottom: 15 },
    lista: { width: "100%" },
    card: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 12, marginBottom: 12, gap: 12, borderWidth: 1, borderColor: "rgba(150, 150, 150, 0.1)" },
    fotoMiniatura: { width: 70, height: 70, borderRadius: 10, backgroundColor: "rgba(150, 150, 150, 0.1)" },
    informacoes: { flex: 1 },
    dado: { fontSize: 13, opacity: 0.7, marginTop: 2 },
    botoes: { flexDirection: "column", gap: 15 },
    botaoAcao: { width: 50, height: 50, borderRadius: 8, backgroundColor: "#0a7ea4", justifyContent: "center", alignItems: "center" },
    botaoRecarregar: { backgroundColor: "#0a7ea4", borderRadius: 8, paddingHorizontal: 30, height: 50, marginTop: 20, alignSelf: "center", justifyContent: "center" },
    textoBotao: { fontSize: 16, color: "#fff", fontWeight: "600" },
    nome: { fontSize: 17, fontWeight: "bold" }
});