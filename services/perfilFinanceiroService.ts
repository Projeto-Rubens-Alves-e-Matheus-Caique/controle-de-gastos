import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

export type StreamingPlanTier = 'barato' | 'medio' | 'caro';

export type PerfilFinanceiro = {
  onboardingCompleted: boolean;
  profileAvatarUri: string | null;
  occupation: string;
  monthlyIncome: number;
  usesStreaming: boolean;
  streamingServices: string[];
  streamingPlanTier: StreamingPlanTier | null;
};

type PerfilFinanceiroInput = Partial<PerfilFinanceiro>;

function getPerfilRef() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Usuario nao autenticado');
  }

  return doc(db, 'users', user.uid, 'perfil', 'financeiro');
}

function normalizePerfil(data: any): PerfilFinanceiro {
  const occupation = typeof data.occupation === 'string' ? data.occupation : '';
  const monthlyIncome = typeof data.monthlyIncome === 'number' ? data.monthlyIncome : 0;

  return {
    onboardingCompleted: Boolean(data.onboardingCompleted || (occupation.trim() && monthlyIncome > 0)),
    profileAvatarUri: typeof data.profileAvatarUri === 'string' ? data.profileAvatarUri : null,
    occupation,
    monthlyIncome,
    usesStreaming: Boolean(data.usesStreaming),
    streamingServices: Array.isArray(data.streamingServices) ? data.streamingServices : [],
    streamingPlanTier:
      data.streamingPlanTier === 'barato' || data.streamingPlanTier === 'medio' || data.streamingPlanTier === 'caro'
        ? data.streamingPlanTier
        : null,
  };
}

export const buscarPerfilFinanceiro = async (): Promise<PerfilFinanceiro | null> => {
  const user = auth.currentUser;

  if (!user) return null;

  const snapshot = await getDoc(getPerfilRef());

  if (!snapshot.exists()) return null;

  return normalizePerfil(snapshot.data());
};

export const salvarPerfilFinanceiro = async (perfil: PerfilFinanceiroInput) => {
  await setDoc(
    getPerfilRef(),
    {
      ...perfil,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};
