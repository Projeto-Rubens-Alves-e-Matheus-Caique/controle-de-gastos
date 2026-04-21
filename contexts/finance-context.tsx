import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { trintaDias } from '@/services/gastosServices';
import { adicionarGasto } from '@/services/gastosServices';
import { serverTimestamp, Timestamp } from 'firebase/firestore';

export type StreamingPlanTier = 'barato' | 'medio' | 'caro';

export type Expense = {
  id: string;
  amount: number;
  category: string;
  description: string;
  createdAt: number | Timestamp;
};

function getDate(value: number | any): Date {
  if (value?.toDate) {
    return value.toDate(); // Firebase Timestamp
  }
  return new Date(value); // number
}

export type Period = '7d' | '30d' | '180d' | '365d';

const PERIOD_DAYS: Record<Period, number> = {
  '7d': 7,
  '30d': 30,
  '180d': 180,
  '365d': 365,
};

const STREAMING_CATEGORY = 'Streaming';

const TIER_FACTOR: Record<StreamingPlanTier, number> = {
  barato: 0.78,
  medio: 1,
  caro: 1.32,
};

/** Valores base mensais aproximados (R$) por servico */
const SERVICE_BASE_BRL: Record<string, number> = {
  Netflix: 45,
  'Prime Video': 15,
  HBO: 45,
  Twitch: 25,
  'Disney Plus': 35,
  'Apple TV': 35,
  'Globo Play': 55,
  Paramount: 35,
};

const ALL_SERVICE_KEYS = Object.keys(SERVICE_BASE_BRL);

export function parseMoneyInput(raw: string): number {
  const trimmed = raw.trim();
  if (!trimmed) return 0;
  const noThousands = trimmed.includes(',') ? trimmed.replace(/\./g, '').replace(',', '.') : trimmed.replace(/,/g, '');
  const n = parseFloat(noThousands.replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function estimateStreamingMonthly(services: string[], tier: StreamingPlanTier | null): number {
  if (!tier || services.length === 0) return 0;

  const allOption = 'Assino todos os servicos';
  let totalBase = 0;

  if (services.includes(allOption)) {
    totalBase = ALL_SERVICE_KEYS.reduce((sum, key) => sum + (SERVICE_BASE_BRL[key] ?? 0), 0) * 0.92;
  } else {
    for (const s of services) {
      totalBase += SERVICE_BASE_BRL[s] ?? 32;
    }
  }

  return Math.round(totalBase * TIER_FACTOR[tier] * 100) / 100;
}

function normalizeCategory(cat: string): string {
  const c = cat.trim().toLowerCase();
  if (!c) return 'Outros';
  if (c.includes('stream')) return STREAMING_CATEGORY;
  return cat.trim() || 'Outros';
}

type OnboardingPayload = {
  occupation: string;
  monthlyIncome: number;
  usesStreaming: boolean;
  streamingServices: string[];
  streamingPlanTier: StreamingPlanTier | null;
};

type FinanceContextValue = {
  onboardingCompleted: boolean;
  /** URI da foto de perfil (galeria/camera); usada tambem no icone da aba. */
  profileAvatarUri: string | null;
  setProfileAvatarUri: (uri: string | null) => void;
  occupation: string;
  monthlyIncome: number;
  usesStreaming: boolean;
  streamingServices: string[];
  streamingPlanTier: StreamingPlanTier | null;
  streamingEstimatedMonthly: number;
  expenses: Expense[];
  setOnboarding: (data: OnboardingPayload) => void;
  setMonthlyIncome: (value: number) => void;
  setOccupation: (value: string) => void;
  addExpense: (input: { amount: number; category: string; description: string }) => void;
  categoryBreakdown: { name: string; value: number; color: string }[];
  totalSpent: number;
  freeToSpend: number;
  monthlyBars: { key: string; label: string; total: number }[];
  period: Period;
  setPeriod: (p: Period) => void;
};

const CATEGORY_COLORS = [
  '#C8AA56',
  '#3E7B65',
  '#6D8E81',
  '#8EA89D',
  '#4A7C8C',
  '#7B9E91',
  '#B8C8C2',
  '#2E6B5C',
];

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [profileAvatarUri, setProfileAvatarUri] = useState<string | null>(null);
  const [occupation, setOccupation] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [usesStreaming, setUsesStreaming] = useState(false);
  const [streamingServices, setStreamingServices] = useState<string[]>([]);
  const [streamingPlanTier, setStreamingPlanTier] = useState<StreamingPlanTier | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [period, setPeriod] = useState<Period>('30d');

  useEffect(() => {
    const carregar = async () => {
      const dados = await trintaDias();
      setExpenses(dados as Expense[]);
    };

    carregar();
  }, []);

  const streamingEstimatedMonthly = useMemo(
    () => (usesStreaming ? estimateStreamingMonthly(streamingServices, streamingPlanTier) : 0),
    [usesStreaming, streamingServices, streamingPlanTier],
  );

  const setOnboarding = useCallback((data: OnboardingPayload) => {
    setOccupation(data.occupation);
    setMonthlyIncome(data.monthlyIncome);
    setUsesStreaming(data.usesStreaming);
    setStreamingServices(data.streamingServices);
    setStreamingPlanTier(data.streamingPlanTier);
    setOnboardingCompleted(true);
  }, []);

  const addExpense = useCallback(async (input: { amount: number; category: string; description: string }) => {
    if (input.amount <= 0) return;

    const newExpense = {
      amount: Math.round(input.amount * 100) / 100,
      category: normalizeCategory(input.category),
      description: input.description.trim(),
      createdAt: Date.now(), // UI imediata
    };

    try {
      // salva no Firebase
      await adicionarGasto({
        amount: newExpense.amount,
        category: newExpense.category,
        description: newExpense.description,
      });

      // atualiza local (sem esperar reload)
      setExpenses((prev) => [
        ...prev,
        {
          ...newExpense,
          id: `${Date.now()}`, // id temporário
          createdAt: Date.now(),
        },
      ]);
    } catch (error) {
      console.error('Erro ao salvar gasto:', error);
    }
  }, []);

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    const days = PERIOD_DAYS[period];

    return expenses.filter((e) => {
      const date = getDate(e.createdAt);

      const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

      return diff <= days;
    });
  }, [expenses, period]);

  const { categoryBreakdown, totalSpent, freeToSpend, monthlyBars } = useMemo(() => {
    const map = new Map<string, number>();

    if (streamingEstimatedMonthly > 0) {
      map.set(STREAMING_CATEGORY, streamingEstimatedMonthly);
    }

    for (const e of filteredExpenses) {
      const key = e.category;
      map.set(key, (map.get(key) ?? 0) + e.amount);
    }

    const entries = [...map.entries()].filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
    const breakdown = entries.map(([name, value], i) => ({
      name,
      value: Math.round(value * 100) / 100,
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
    }));

    const spent = entries.reduce((s, [, v]) => s + v, 0);
    const free = Math.max(0, Math.round((monthlyIncome - spent) * 100) / 100);

    const now = new Date();
    const bars: { key: string; label: string; total: number }[] = [];

    const groupedMap = new Map<string, { total: number; label: string }>();

    for (const e of filteredExpenses) {
      const date = getDate(e.createdAt);

      let key = '';
      let label = '';

      if (period === '180d' || period === '365d') {
        key = `${date.getFullYear()}-${date.getMonth()}`;
        label = date.toLocaleDateString('pt-BR', { month: 'short' });
      } else {
        key = date.toISOString().slice(0, 10);
        label = date.getDate().toString();
      }
      
      const current = groupedMap.get(key);

      groupedMap.set(key, {
        total: (current?.total ?? 0) + e.amount,
        label,
      });
    }

    for (const [key, value] of groupedMap.entries()) {
      bars.push({
        key,
        label: value.label,
        total: Math.round(value.total * 100) / 100,
      });
    }

    bars.sort((a, b) => a.key.localeCompare(b.key));

    return {
      categoryBreakdown: breakdown,
      totalSpent: Math.round(spent * 100) / 100,
      freeToSpend: free,
      monthlyBars: bars,
    };
  }, [filteredExpenses, monthlyIncome, streamingEstimatedMonthly, period]);

  const value: FinanceContextValue = {
    onboardingCompleted,
    profileAvatarUri,
    setProfileAvatarUri,
    occupation,
    monthlyIncome,
    usesStreaming,
    streamingServices,
    streamingPlanTier,
    streamingEstimatedMonthly,
    expenses,
    setOnboarding,
    setMonthlyIncome,
    setOccupation,
    addExpense,
    categoryBreakdown,
    totalSpent,
    freeToSpend,
    monthlyBars,
    period,
    setPeriod,
  };
  
  console.log('EXPENSES:', expenses);
  console.log('FILTERED EXPENSES:', filteredExpenses);
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return ctx;
}

