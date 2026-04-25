import { useFinance } from '@/contexts/finance-context';
import { Redirect } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PagamentoScreen() {
  const { onboardingCompleted } = useFinance();

  if (!onboardingCompleted) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.scroll}>
      <Text style={styles.title}>Pagamento</Text>
      <Text style={styles.subtitle}>Acompanhe aqui os dados de pagamento do seu controle.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Nova aba adicionada</Text>
        <Text style={styles.cardText}>
          Essa area esta pronta para receber informacoes de pagamentos, vencimentos e status.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#F6F7F3',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 32,
    backgroundColor: '#F6F7F3',
    gap: 14,
  },
  title: {
    color: '#0B2E23',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#40534D',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D9DEE8',
    padding: 18,
  },
  cardTitle: {
    color: '#1E2430',
    fontSize: 16,
    fontWeight: '700',
  },
  cardText: {
    color: '#6D7787',
    fontSize: 13,
    marginTop: 6,
    lineHeight: 20,
  },
});
