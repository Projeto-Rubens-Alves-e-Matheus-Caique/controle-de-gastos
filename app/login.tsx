import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
      <View style={styles.brand}>
        <Image source={require('@/assets/images/app-logo.png')} style={styles.logo} contentFit="contain" />
        <Text style={styles.appName}>BudGet</Text>
      </View>

      <Text style={styles.title}>Login</Text>

      <View style={styles.formArea}>
        <View style={styles.goldBand} />
        <View style={styles.form}>
          <Text style={styles.label}>E-mail</Text>
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

          <TouchableOpacity onPress={entrarNoApp} style={styles.button} activeOpacity={0.82}>
            <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Link href="/criar-conta" style={styles.link}>
        Criar conta
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0B2E23',
    paddingHorizontal: 10,
    paddingTop: 56,
  },
  brand: {
    alignItems: 'center',
    marginBottom: 76,
  },
  logo: {
    width: 82,
    height: 82,
    marginBottom: 8,
  },
  appName: {
    color: '#F7F8F5',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  title: {
    color: '#F7F8F5',
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  formArea: {
    width: '108%',
    maxWidth: 420,
    alignItems: 'center',
    position: 'relative',
    marginLeft: -30,
  },
  goldBand: {
    position: 'absolute',
    top: -10,
    left: -26,
    right: 18,
    height: 22,
    backgroundColor: '#C8A348',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  form: {
    width: '100%',
    backgroundColor: '#F5F5F3',
    borderColor: '#E0E0DE',
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    borderWidth: 1,
    paddingLeft: 28,
    paddingRight: 10,
    paddingTop: 14,
    paddingBottom: 10,
  },
  label: {
    color: '#143429',
    fontSize: 13,
    marginBottom: 3,
  },
  input: {
    height: 36,
    backgroundColor: '#FFFFFF',
    borderColor: '#D4D4D4',
    borderRadius: 5,
    borderWidth: 1,
    color: '#0D2C22',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  button: {
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C8A348',
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    color: '#0B2E23',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  link: {
    color: '#CDB35D',
    fontSize: 14,
    marginTop: 18,
    textAlign: 'center',
  },
});
