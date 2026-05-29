import React from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useEstoque } from '@/features/produtos/hooks/useEstoque';

export default function EstoqueScreen() {
  const { data: produtos, isLoading } = useEstoque();
  console.log("O que o hook trouxe do banco:", produtos);
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#27ae60" />
      </View>
    );
  }

  // Lógica de correção: Garante que 'listaParaExibir' seja sempre um Array
  // Se 'produtos' for um objeto único, transformamos em array. Se for array, usamos ele.
  const listaParaExibir = Array.isArray(produtos) 
    ? produtos 
    : (produtos ? [produtos] : []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Produtos em Estoque</Text>
      
      <FlatList
        data={listaParaExibir}
        keyExtractor={(item: any) => item?.id ? item.id.toString() : Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item?.nome || 'Sem nome'}</Text>
            <Text style={styles.info}>
              Preço: R$ {item?.preco || '0.00'} | Qtd: {item?.qtd || '0'}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum produto cadastrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  header: { fontSize: 24, color: '#27ae60', fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10 },
  nome: { fontSize: 18, fontWeight: 'bold' },
  info: { color: '#555', fontSize: 14, marginTop: 5 },
  vazio: { color: '#fff', textAlign: 'center', marginTop: 50 }
});