import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [occupation, setOccupation] = useState('');
  const [income, setIncome] = useState('');
  const [usesStreaming, setUsesStreaming] = useState<'sim' | 'nao' | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo Financeiro</Text>
      <Text style={styles.subtitle}>Responda essas perguntas para personalizar seu controle.</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Com que trabalha?</Text>
        <TextInput
          value={occupation}
          onChangeText={setOccupation}
          placeholder="Ex: Designer, Vendedor, Estudante..."
          placeholderTextColor="#70807A"
          style={styles.input}
        />

        <Text style={styles.label}>Quanto recebe por mes?</Text>
        <TextInput
          value={income}
          onChangeText={setIncome}
          placeholder="Ex: 3500"
          placeholderTextColor="#70807A"
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Assina algum servico de streaming?</Text>
        <View style={styles.choiceRow}>
          <Pressable
            onPress={() => setUsesStreaming('sim')}
            style={[styles.choiceButton, usesStreaming === 'sim' && styles.choiceButtonActive]}>
            <Text style={[styles.choiceText, usesStreaming === 'sim' && styles.choiceTextActive]}>Sim</Text>
          </Pressable>
          <Pressable
            onPress={() => setUsesStreaming('nao')}
            style={[styles.choiceButton, usesStreaming === 'nao' && styles.choiceButtonActive]}>
            <Text style={[styles.choiceText, usesStreaming === 'nao' && styles.choiceTextActive]}>Nao</Text>
          </Pressable>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/login')}>
        <Text style={styles.logoutText}>Voltar para LoginScreen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F3',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: '#0B2E23',
    fontWeight: '700',
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    color: '#40534D',
    fontSize: 15,
    marginBottom: 14,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderColor: '#C8AA56',
    borderWidth: 1,
    padding: 18,
  },
  label: {
    color: '#184335',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7DDD8',
    borderRadius: 12,
    color: '#0D2C22',
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 8,
  },
  choiceRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  choiceButton: {
    flex: 1,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#B6C0BB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  choiceButtonActive: {
    borderColor: '#C8AA56',
    backgroundColor: '#F7EFCF',
  },
  choiceText: {
    color: '#26453A',
    fontWeight: '600',
  },
  choiceTextActive: {
    color: '#0B2E23',
  },
  logoutButton: {
    marginTop: 18,
    backgroundColor: '#0B2E23',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  logoutText: {
    color: '#F5EBC8',
    fontWeight: '700',
    fontSize: 14,
  },
});
