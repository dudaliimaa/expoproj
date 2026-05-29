import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Image } from "expo-image";
import TirarFoto from "@/features/camera/TirarFotoScreen";
import { useEstoque } from "@/features/produtos/hooks/useEstoque";
import { useEditProduto } from "@/features/produtos/hooks/useEditProduto";

const schema = yup.object({
    nome: yup.string().required("Nome obrigatório"),
    categoria: yup.string().required("Categoria obrigatória"),
    preco: yup.number().typeError("Deve ser um número").required("Preço obrigatório"),
    qtd: yup.number().typeError("Deve ser um número").required("Qtd obrigatória"),
    validade: yup.string().required("Data obrigatória"),
    descricao: yup.string(),
}).required();

export default function ProdutoEditScreen() {
    const { id } = useLocalSearchParams();
    const [urifoto, setUrifoto] = useState("");
    const [base64, setBase64] = useState("");
    const [location, setLocation] = useState<any>(null);
    
    const { mutate } = useEditProduto();
    const { data: produto, isLoading } = useEstoque(id as string);
    
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        // Trata o produto caso o hook retorne um array ou um objeto único
        const produtoDados = Array.isArray(produto) ? produto[0] : produto;
        
        if (produtoDados) {
            reset(produtoDados);
            // Acessa 'imagem' verificando se existe no objeto
            if (produtoDados && 'imagem' in produtoDados && (produtoDados as any).imagem) {
                setUrifoto(`data:image/jpeg;base64,${(produtoDados as any).imagem}`);
            }
        }
    }, [produto, reset]);

    const onSubmit = async (data: any) => {
        const produtoDados = Array.isArray(produto) ? produto[0] : produto;
        const imagemOriginal = (produtoDados as any)?.imagem || "";

        mutate({ 
            id: id as string, 
            ...data, 
            imagem: base64 || imagemOriginal, 
            coordenada: location 
        });
    };

    if (isLoading) return <ThemedView style={estilo.pagina}><ThemedText>Carregando...</ThemedText></ThemedView>;

    return (
        <ThemedView style={estilo.pagina}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ThemedText type="title" style={estilo.titulo}>Editar Produto</ThemedText>

                <View style={estilo.secaoCamera}>
                    {urifoto ? (
                        <View style={estilo.previewContainer}>
                            <Image source={{ uri: urifoto }} style={estilo.previewImage} />
                            <Pressable onPress={() => {setUrifoto(""); setBase64(""); setLocation(null);}}>
                                <Text style={estilo.textoBotaoTrocar}>Trocar Foto</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <TirarFoto 
                            setURI={setUrifoto} 
                            setBase64={setBase64} 
                            setLocation={setLocation} 
                        />
                    )}
                </View>

                {(['nome', 'categoria', 'preco', 'qtd', 'validade', 'descricao'] as const).map((field) => (
                    <View key={field} style={estilo.caixaInput}>
                        <Text style={estilo.textoInput}>{field.toUpperCase()}</Text>
                        <Controller
                            control={control}
                            name={field}
                            render={({ field: { onChange, value } }) => (
                                <TextInput 
                                    style={[estilo.input, errors[field] && estilo.inputErro]} 
                                    onChangeText={onChange} value={value?.toString()}
                                    placeholder={`Digite o ${field}...`} placeholderTextColor="#999"
                                />
                            )}
                        />
                        {errors[field] && <Text style={estilo.erro}>{(errors[field] as any)?.message}</Text>}
                    </View>
                ))}

                <Pressable style={estilo.botaoSalvar} onPress={handleSubmit(onSubmit)}>
                    <Text style={estilo.textoBotao}>SALVAR ALTERAÇÕES</Text>
                </Pressable>
            </ScrollView>
        </ThemedView>
    );
}

const estilo = StyleSheet.create({
    pagina: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#121212' },
    titulo: { color: '#27ae60', marginBottom: 20, textAlign: 'center' },
    secaoCamera: { marginBottom: 25, alignItems: 'center' },
    previewImage: { width: 200, height: 200, borderRadius: 15, marginBottom: 10 },
    caixaInput: { marginBottom: 15 },
    textoInput: { color: '#e67e22', fontWeight: 'bold', marginBottom: 5 },
    input: { height: 50, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 15, borderWidth: 2, borderColor: '#e67e22' },
    inputErro: { borderColor: '#c0392b' },
    botaoSalvar: { height: 60, backgroundColor: '#27ae60', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    textoBotaoTrocar: { color: '#e67e22', textDecorationLine: 'underline' },
    erro: { color: '#c0392b', fontSize: 12, marginTop: 4 },
    previewContainer: { alignItems: 'center' }
});