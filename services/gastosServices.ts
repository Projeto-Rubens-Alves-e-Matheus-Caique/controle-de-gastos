import { getFirestore, collection, addDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Timestamp } from 'firebase/firestore';
import { getDocs } from 'firebase/firestore';
import { Expense } from '@/contexts/finance-context';

type FirestoreExpense = NewExpense & {
  createdAt: any;
};

type NewExpense = {
    amount: number;
    category: string;
    description: string;
};

export const adicionarGasto = async (gasto: NewExpense) => {
    const data: FirestoreExpense = {
        ...gasto,
        createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, 'gastos'), data);
};

export const trintaDias = async ():Promise<Expense[]> => {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - 30);

    const q = query(
        collection(db, 'gastos'),
        where('createdAt', '>=', Timestamp.fromDate(dataLimite))
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc): Expense => {
        const data = doc.data();

        return {
            id: doc.id,
            amount: data.amount ?? 0,
            category: data.category ?? 'Outros',
            description: data.description ?? '',
            createdAt: data.createdAt?.toDate().getTime() || Date.now(),
        };
    });
}





