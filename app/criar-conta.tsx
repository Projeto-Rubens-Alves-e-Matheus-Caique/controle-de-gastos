import { router } from 'expo-router';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { register } from '@/services/authService';
import { useAuth } from '@/contexts/auth-context';

export default function CreateAccountScreen() {
  const { updateProfileName } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const trimmedName = name.trim();

    if (!trimmedName || !email || !password){
      alert('Preencha todos os campos');
      return;
    }
    try {
      setLoading(true);

      await register(email, password, trimmedName);
      await updateProfileName(trimmedName);

      alert('Conta criada com sucesso!');

      router.replace('/(tabs)');
    } catch (error : any) {
      console.log(error);

      if (error.code === 'auth/email-already-in-use') {
        alert('Este email já está em uso. Tente outro.');

      } else if (error.code === 'auth/invalid-email') {
        alert('Email inválido. Verifique o formato e tente novamente.');

      } else if (error.code === 'auth/weak-password') {
        alert('A senha é muito fraca. Use pelo menos 6 caracteres.');

      } else {
        alert('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>
      <Text style={styles.subtitle}>Cadastre seus dados para começar o controle financeiro</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput 
        placeholder="Seu nome completo" 
        placeholderTextColor="#6E7B75" 
        style={styles.input} 
        value={name}
        onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Digite seu email"
          placeholderTextColor="#6E7B75"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="Crie uma senha"
          placeholderTextColor="#6E7B75"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>
            {loading ? 'Criando...' : 'Criar conta'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F3',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    color: '#0F2E24',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: '#51655E',
    fontSize: 14,
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderColor: '#C8AA56',
    borderWidth: 1,
    padding: 18,
  },
  label: {
    color: '#1D4638',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D7DDD8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: '#0F2E24',
    marginBottom: 8,
    backgroundColor: '#FDFEFE',
  },
  button: {
    marginTop: 12,
    backgroundColor: '#0B2E23',
    paddingVertical: 13,
    borderRadius: 12,
  },
  buttonText: {
    color: '#F5EBC8',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
});
