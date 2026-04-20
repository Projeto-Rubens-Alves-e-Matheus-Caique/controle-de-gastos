import { useFinance } from '@/contexts/finance-context';
import { Redirect } from 'expo-router';

/** Rota legada: nao aparece na barra de abas; redireciona para o fluxo principal. */
export default function ExploreRedirectScreen() {
  const { onboardingCompleted } = useFinance();

  if (!onboardingCompleted) {
    return <Redirect href="/(tabs)" />;
  }
  return <Redirect href="/(tabs)/gastos" />;
}
