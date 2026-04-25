import { collection, addDoc, serverTimestamp, Timestamp, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Expense } from '@/contexts/finance-context';
import { auth } from './firebaseConfig';

type FirestoreExpense = NewExpense & {
  createdAt: any;
};

type NewExpense = {
    amount: number;
    category: string;
    description: string;
};

export const adicionarGasto = async (gasto: NewExpense) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('Usuário não autenticado');
    }

    await addDoc(collection(db, 'users', user.uid, 'gastos'), {
        ...gasto,
        createdAt: serverTimestamp(),
    });
};

export const listarGastos = async (): Promise<Expense[]> => {
    const user = auth.currentUser;
    
    if (!user) return [];

    const snapshot = await getDocs(collection(db, 'users', user.uid, 'gastos'));

    return snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
            id: doc.id,
            amount: data.amount,
            category: data.category,
            description: data.description,
            createdAt: data.createdAt?.toDate().getTime() || Date.now(),
        };
    });
}

export const trintaDias = listarGastos;





