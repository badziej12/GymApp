import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
  signOut,
  signInWithEmailAndPassword
} from "firebase/auth"
import { auth, db } from '@/firebaseConfig';
import { addDoc, doc, setDoc } from '@firebase/firestore';
import { ErrorData } from '@firebase/util';

export const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<{ success: boolean; msg?: string }>;
  logout: () => Promise<{ success: boolean; msg?: string; error?: string }>;
  signUp: (email: string, password: string, username: string) => Promise<{ success: boolean; data?: User; msg?: string }>;
  session?: string | null;
  isAuthenticated: boolean;
}>({
  signIn: async () => ({ success: false, msg: '' }),
  signUp: async () => ({ success: false, msg: '' }),
  logout: async () => ({ success: false, msg: '' , error: ''}),
  session: null,
  isAuthenticated: false,
});

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // on auth state changed
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log('got user:', user);
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return unsub;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (e: any) {
      let msg = e.message;
      if (msg.includes('(auth/invalid-email')) msg='Invalid email'
      if (msg.includes('(auth/invalid-credential')) msg='Invalid credentials'
      return { success: false, msg: msg }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth);
      return {success: true}
    } catch (e: any) {
      return {success: false, msg: e.message, error: e}
    }
  }

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log('response.user : ', response?.user);
      await setDoc(doc(db, "users", response?.user?.uid), {
        username,
        userId: response?.user?.uid
      });
      return {success: true, data: response?.user};
    } catch (e: any) {
      let msg = e.message;
      if (msg.includes('(auth/invalid-email')) msg='Invalid email'
      if (msg.includes('(auth/email-already-in-use')) msg='This email is already in use'
      return {success: false, msg: msg}
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logout, signUp, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}