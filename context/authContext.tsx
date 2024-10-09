import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  signUp: () => void;
  session?: string | null;
  isAuthenticated: boolean;
}>({
  signIn: () => null,
  signUp: () => null,
  signOut: () => null,
  session: null,
  isAuthenticated: false,
});

export const useAuth = () => {
  const value = useContext(AuthContext);
  if(!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // on auth state changed
    setTimeout(() => {
      setIsAuthenticated(false);
    }, 3000)
  }, []);

  const signIn = async (email, passowrd) => {
    try {

    } catch (e) {

    }
  }

  const signOut = async () => {
    try {

    } catch (e) {

    }
  }

  const signUp = async (email, passowrd, username, profileUrl) => {
    try {

    } catch (e) {

    }
  }

  return (
    <AuthContext.Provider value={{user, isAuthenticated, signIn, signUp, signOut}}>
      {children}
    </AuthContext.Provider>
  )
}