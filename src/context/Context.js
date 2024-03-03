import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';

const Context = createContext();

export function CtxProvider({ children }) {
  //Felhasználó authentikáció utáni adatai
  const [user, setUser] = useState(null);
  //Felhasználó adatbázisbeli adatai
  const [userData, setUserData] = useState();
  const [scenes, setScenes] = useState();
  const [currentScene, setCurrentScene] = useState();
  const [sceneId, setSceneId] = useState();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        const unsubscribe = onSnapshot(doc(db, 'users', user?.email), (doc) => {
          setUserData(doc.data());
        });
        return () => unsubscribe();
      }
    });
    return () => unsubscribe();
  }, []);

  console.log(scenes);
  console.log(userData);

  useEffect(() => {
    if (user && userData?.scenes?.length >= 1) {
      const userScenes = [];
      userData?.scenes?.forEach((scene) => {
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
      return () => {
        unsubscribe();
      };
    }
  }, [user, userData]);

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

  return (
    <Context.Provider
      value={{ user, userData, currentScene, scenes, setSceneId }}
    >
      {children}
    </Context.Provider>
  );
}

export function useCtx() {
  return useContext(Context);
}
