import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';

const Context = createContext();

export function CtxProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userDbData, setUserDbData] = useState();
  const [scenes, setScenes] = useState();
  const [currentScene, setCurrentScene] = useState();
  const [sceneId, setSceneId] = useState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      const unsubscribe = onSnapshot(doc(db, 'users', user.email), (doc) => {
        setUserDbData(doc.data());
      });
      return () => unsubscribe();
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && userDbData?.scenes?.length >= 1) {
      const userScenes = [];
      userDbData?.scenes?.forEach((scene) => {
        userScenes.push(scene.id);
      });
      const q = query(collection(db, 'scenes'), where('id', 'in', userScenes));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const scenesTmp = [];
        querySnapshot.forEach((doc) => {
          scenesTmp.push(doc.data());
        });
        setScenes(scenesTmp);
      });
      return () => unsubscribe();
    }
  }, [user, userDbData]);
  console.log(scenes);

  useEffect(() => {
    if (scenes && sceneId) {
      const scene = scenes?.filter((scene) => scene?.id == sceneId);
      if (!scene) {
        setCurrentScene(null);
      } else {
        setCurrentScene(...scene);
      }
    }
  }, [sceneId, scenes]);

  function getScene(id) {
    if (currentScene?.id == id) return;

    const scene = scenes?.filter((scene) => scene?.id == id);
    if (!scene) {
      setCurrentScene(null);
    } else {
      setCurrentScene(...scene);
    }
  }

  return (
    <Context.Provider value={{ user, currentScene, getScene, setSceneId }}>
      {children}
    </Context.Provider>
  );
}

export function useCtx() {
  return useContext(Context);
}
