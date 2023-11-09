import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      login(user);
    });
    return () => unsubscribe();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
