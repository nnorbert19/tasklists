import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(user && user.uid ? true : false);
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, isLoggedIn, loading };
};
export default useAuth;
