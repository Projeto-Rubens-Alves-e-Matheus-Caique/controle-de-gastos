import { Link, router } from 'expo-router';
import { Image } from 'expo-image';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { login } from '@/services/authService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const entrarNoApp = async () => {
    if (!email.trim() || !password.trim()) {
      alert('Preencha email e senha.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        alert('Email ou senha invalidos.');
      } else if (error.code === 'auth/invalid-email') {
        alert('Email invalido.');
      } else {
        alert('Nao foi possivel entrar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/images/app-logo.png')} style={styles.logo} contentFit="contain" />
      </View>

      <Text style={styles.title}>Controle de Gastos</Text>
      <Text style={styles.subtitle}>Entre com seu login para continuar</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Seu email"
          placeholderTextColor="#6E7B75"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Sua senha"
          placeholderTextColor="#6E7B75"
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity onPress={entrarNoApp} style={styles.button}>
          <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
        </TouchableOpacity>
      </View>

      <Link href="/criar-conta" style={styles.createAccount}>
        Criar conta
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B2E23',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  logo: {
    width: 126,
    height: 126,
    borderRadius: 28,
  },
  title: {
    color: '#F7F8F5',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: '#CCD7D2',
    textAlign: 'center',
    marginBottom: 26,
    fontSize: 14,
  },
  form: {
    backgroundColor: '#F3F5EF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#C8AA56',
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
    borderColor: '#D9DED9',
    borderWidth: 1,
    borderRadius: 12,
    color: '#0D2C22',
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 8,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#C8AA56',
    paddingVertical: 13,
    borderRadius: 12,
  },
  buttonText: {
    color: '#0B2E23',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  createAccount: {
    marginTop: 18,
    textAlign: 'center',
    color: '#E8D39D',
    fontSize: 15,
    fontWeight: '600',
  },
});
