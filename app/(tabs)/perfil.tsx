import { parseMoneyInput, useFinance } from '@/contexts/finance-context';
import { Redirect, router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const avatarOptions = [
  'https://i.pravatar.cc/220?img=12',
  'https://i.pravatar.cc/220?img=32',
  'https://i.pravatar.cc/220?img=48',
  'https://i.pravatar.cc/220?img=54',
];

export default function PerfilScreen() {
  const {
    onboardingCompleted,
    occupation: ctxOccupation,
    monthlyIncome,
    setOccupation: setCtxOccupation,
    setMonthlyIncome,
  } = useFinance();

  if (!onboardingCompleted) {
    return <Redirect href="/(tabs)" />;
  }
  const [name] = useState('Usuario');
  const [occupation, setOccupation] = useState(ctxOccupation || 'Designer');
  const [salary, setSalary] = useState(monthlyIncome > 0 ? String(monthlyIncome) : '3500');
  const [avatarIndex, setAvatarIndex] = useState(0);

  const avatarUri = useMemo(() => avatarOptions[avatarIndex], [avatarIndex]);

  useEffect(() => {
    if (ctxOccupation.trim()) setOccupation(ctxOccupation);
  }, [ctxOccupation]);

  useEffect(() => {
    if (monthlyIncome > 0) setSalary(String(monthlyIncome));
  }, [monthlyIncome]);

  const handleChangePhoto = () => {
    setAvatarIndex((current) => (current + 1) % avatarOptions.length);
  };

  const handleSave = () => {
    setCtxOccupation(occupation.trim());
    setMonthlyIncome(parseMoneyInput(salary));
    Alert.alert('Salvo', 'Profissao e salario atualizados.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.subtitle}>Atualize seus dados pessoais e financeiros.</Text>

      <View style={styles.card}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <Text style={styles.name}>{name}</Text>
        <Pressable onPress={handleChangePhoto} style={styles.photoButton}>
          <Text style={styles.photoButtonText}>Alterar foto</Text>
        </Pressable>

        <Text style={styles.label}>Profissao</Text>
        <TextInput
          value={occupation}
          onChangeText={setOccupation}
          placeholder="Digite sua profissao"
          placeholderTextColor="#6D7F79"
          style={styles.input}
        />

        <Text style={styles.label}>Salario</Text>
        <TextInput
          value={salary}
          onChangeText={setSalary}
          placeholder="Digite seu salario"
          keyboardType="numeric"
          placeholderTextColor="#6D7F79"
          style={styles.input}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar alteracoes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/login')}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: '#4A6158',
    fontSize: 14,
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE5E1',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#C8AA56',
  },
  name: {
    marginTop: 8,
    color: '#0E3328',
    fontSize: 16,
    fontWeight: '700',
  },
  photoButton: {
    marginTop: 8,
    marginBottom: 14,
    backgroundColor: '#F7EFCF',
    borderWidth: 1,
    borderColor: '#C8AA56',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  photoButtonText: {
    color: '#0B2E23',
    fontSize: 12,
    fontWeight: '700',
  },
  label: {
    alignSelf: 'flex-start',
    color: '#184335',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 6,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D7DDD8',
    borderRadius: 12,
    color: '#0D2C22',
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 8,
  },
  saveButton: {
    width: '100%',
    marginTop: 8,
    backgroundColor: '#0B2E23',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#F5EBC8',
    fontWeight: '700',
    fontSize: 14,
  },
  logoutButton: {
    width: '100%',
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C9D3CE',
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#2E4C41',
    fontWeight: '700',
    fontSize: 14,
  },
});
