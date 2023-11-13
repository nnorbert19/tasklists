import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const Context = createContext();

export function CtxProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sceneId, setSceneId] = useState(null);
  const [scene, setScene] = useState();
  const [sceneLoading, setSceneLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (sceneId) {
      const unsub = onSnapshot(doc(db, 'scenes', sceneId), (doc) => {
        console.log(doc.data());
        setScene(doc.data());
      });

      return unsub;
    }
  }, [sceneId]);

  function getScene(scene) {
    if (scene) {
      setSceneId(scene.id);
    } else {
      setScene(null);
    }
    setSceneLoading(false);
  }

  return (
    <Context.Provider value={{ user, scene, sceneLoading, getScene }}>
      {children}
    </Context.Provider>
  );
}

export function useCtx() {
  return useContext(Context);
}
