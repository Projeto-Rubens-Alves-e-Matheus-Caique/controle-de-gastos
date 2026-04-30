import { createContext, useContext, useEffect, useState} from 'react';
import { auth } from '@/services/firebaseConfig';
import { onAuthStateChanged, updateProfile, User } from 'firebase/auth';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  profileName: string;
  updateProfileName: (name: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [profileName, setProfileName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setProfileName(user?.displayName ?? '');
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateProfileName = async (name: string) => {
    const trimmedName = name.trim();
    if (!auth.currentUser || !trimmedName) return;

    await updateProfile(auth.currentUser, { displayName: trimmedName });
    await auth.currentUser.reload();
    setUser(auth.currentUser);
    setProfileName(trimmedName);
  };

  return (
    <AuthContext.Provider value={{ user, loading, profileName, updateProfileName }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
