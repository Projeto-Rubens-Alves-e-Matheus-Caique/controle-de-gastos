import { router } from 'expo-router';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateAccountScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>
      <Text style={styles.subtitle}>Cadastre seus dados para começar o controle financeiro</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput placeholder="Seu nome completo" placeholderTextColor="#6E7B75" style={styles.input} />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Digite seu email"
          placeholderTextColor="#6E7B75"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="Crie uma senha"
          placeholderTextColor="#6E7B75"
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Salvar e voltar</Text>
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
