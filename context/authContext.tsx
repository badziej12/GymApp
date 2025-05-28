import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
  signOut,
  signInWithEmailAndPassword
} from "firebase/auth"
import { auth, db } from '@/firebaseConfig';
import { doc, setDoc, getDoc } from '@firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/store';
import { authActions } from '@/store/auth/auth-slice';
import { updateUserDataAction } from '@/store/auth/auth-actions/update-user-data';

interface ExtendedUser extends User {
  username?: string;
  userId?: string;
}

export const AuthContext = createContext<{
  signIn: (email: string, password: string) => Promise<{ success: boolean; msg?: string }>;
  logout: () => Promise<{ success: boolean; msg?: string; error?: string }>;
  signUp: (email: string, password: string, username: string) => Promise<{ success: boolean; data?: User; msg?: string }>;
  updateUserData: (userId: string) => Promise<void>;
  session?: string | null;
  isAuthenticated: boolean;
  user?: ExtendedUser | null;
}>({
  signIn: async () => ({ success: false, msg: '' }),
  signUp: async () => ({ success: false, msg: '' }),
  logout: async () => ({ success: false, msg: '', error: '' }),
  updateUserData: async () => { },
  session: null,
  isAuthenticated: false,
  user: null,
});

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<ExtendedUser | null>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const userData = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user: ExtendedUser | User | null) => {

      if (user) {
        setIsAuthenticated(true);
        setUser(user);
        dispatch(updateUserDataAction(user.uid));
        updateUserData(user.uid);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return unsub;
  }, []);

  const updateUserData = async (userId: string) => {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      let userData = user as ExtendedUser;
      setUser({ ...userData, username: data.username, userId: data.userId });
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (e: any) {
      let msg = e.message;
      if (msg.includes('(auth/invalid-email')) msg = 'Invalid email'
      if (msg.includes('(auth/invalid-credential')) msg = 'Invalid credentials'
      return { success: false, msg: msg }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true }
    } catch (e: any) {
      return { success: false, msg: e.message, error: e }
    }
  }

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      // console.log('response.user : ', response?.user);
      await setDoc(doc(db, "users", response?.user?.uid), {
        username,
        userId: response?.user?.uid,
        groups: [],
      });
      return { success: true, data: response?.user };
    } catch (e: any) {
      let msg = e.message;
      if (msg.includes('(auth/invalid-email')) msg = 'Invalid email'
      if (msg.includes('(auth/email-already-in-use')) msg = 'This email is already in use'
      return { success: false, msg: msg }
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logout, signUp, signIn, updateUserData }}>
      {children}
    </AuthContext.Provider>
  )
}