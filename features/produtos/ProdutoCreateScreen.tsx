import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert 
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import TirarFoto from '@/features/camera/TirarFotoScreen';
import GpsScreen from '@/features/gps/GpsScreen';

export default function ProdutoCreateScreen() {
  const queryClient = useQueryClient();
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState('');
  const [qtd, setQtd] = useState('');
  const [validade, setValidade] = useState('');
  const [descricao, setDescricao] = useState('');
  
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [localizacao, setLocalizacao] = useState<any>(null);

  const salvarProduto = async () => {
    console.log("Tentando salvar..."); // DEBUG
    
    if (!nome || !preco) {
      Alert.alert("Erro", "Preencha pelo menos o Nome e o Preço.");
      return;
    }
    
    const novoProduto = {
      nome,
      categoria,
      preco: Number(preco), // Convertendo para número
      qtd: Number(qtd),
      validade,
      descricao,
      fotoUri,
      localizacao
    };

    try {
      // Mudei de /estoque para /produtos (tente trocar se der 404 de novo)
      const response = await api.post('/produtos', novoProduto);
      console.log("Sucesso, resposta:", response.data);
      
      Alert.alert("Sucesso", "Produto cadastrado com sucesso!");
      
      queryClient.invalidateQueries({ queryKey: ['estoque'] });
      
      setNome(''); setCategoria(''); setPreco(''); setQtd(''); setValidade(''); setDescricao('');
    } catch (error: any) {
      console.log("Erro completo:", error);
      console.log("URL tentada:", error.config?.url);
      Alert.alert("Erro", "Não foi possível salvar. Verifique o console.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Cadastrar Produto</Text>

      <TextInput style={styles.input} placeholder="Nome do Produto" value={nome} onChangeText={setNome} placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="Categoria" value={categoria} onChangeText={setCategoria} placeholderTextColor="#888" />
      
      <View style={styles.row}>
        <TextInput style={[styles.input, { flex: 1, marginRight: 10 }]} placeholder="Preço (R$)" value={preco} onChangeText={setPreco} keyboardType="numeric" placeholderTextColor="#888" />
        <TextInput style={[styles.input, { flex: 1 }]} placeholder="Qtd" value={qtd} onChangeText={setQtd} keyboardType="numeric" placeholderTextColor="#888" />
      </View>

      <TextInput style={styles.input} placeholder="Validade (AAAA-MM-DD)" value={validade} onChangeText={setValidade} placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="Descrição do Produto" value={descricao} onChangeText={setDescricao} multiline placeholderTextColor="#888" />

      <View style={styles.mediaContainer}>
        <View style={styles.half}>
          <Text style={styles.label}>Foto</Text>
          <TirarFoto setURI={setFotoUri} setBase64={() => {}} setLocation={(loc) => setLocalizacao(loc)} />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>GPS</Text>
          <GpsScreen />
        </View>
      </View>

      <TouchableOpacity 
        style={styles.btnSalvar} 
        onPress={() => {
          console.log("Botão pressionado!");
          salvarProduto();
        }}
      >
        <Text style={styles.btnTexto}>SALVAR PRODUTO</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  content: { padding: 20 },
  title: { fontSize: 24, color: '#27ae60', fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10, color: '#000' },
  row: { flexDirection: 'row' },
  mediaContainer: { flexDirection: 'row', gap: 10, marginVertical: 10 },
  half: { flex: 1 },
  label: { color: '#fff', marginBottom: 5, fontWeight: 'bold' },
  btnSalvar: { backgroundColor: '#27ae60', padding: 18, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  btnTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});