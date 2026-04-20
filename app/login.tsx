import { Link, router } from 'expo-router';
import { Image } from 'expo-image';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const entrarNoApp = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/images/app-logo.png')} style={styles.logo} contentFit="contain" />
      </View>

      <Text style={styles.title}>Controle de Gastos</Text>
      <Text style={styles.subtitle}>Entre com seu login para continuar</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Login</Text>
        <TextInput placeholder="Seu login" placeholderTextColor="#6E7B75" style={styles.input} />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="Sua senha"
          placeholderTextColor="#6E7B75"
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity onPress={entrarNoApp} style={styles.button}>
          <Text style={styles.buttonText}>Entrar</Text>
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
