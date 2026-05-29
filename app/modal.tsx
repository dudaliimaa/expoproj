import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Informações do Quiosque</ThemedText>
      <ThemedText style={styles.texto}>
        Gerencie seu estoque de forma rápida e eficiente.
      </ThemedText>
      
      {/* Ajustado para voltar para a home ou a rota principal que você usa */}
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Voltar para o início</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  texto: {
    marginTop: 10,
    textAlign: 'center',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});