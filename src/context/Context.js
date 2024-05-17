/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getUnixTime } from 'date-fns';
import { usePathname } from 'next/navigation';

const Context = createContext();

export function CtxProvider({ children }) {
  const pathname = usePathname();
  //Felhasználó authentikáció utáni adatai
  const [user, setUser] = useState(null);
  //Felhasználó adatbázisbeli adatai
  const [userData, setUserData] = useState();
  const [scenes, setScenes] = useState();
  const [currentScene, setCurrentScene] = useState();
  const [sceneId, setSceneId] = useState();
  const [messages, setMessages] = useState();
  const [notifications, setNotifications] = useState([]);
  const [lastActivity, setLastActivity] = useState();

  function deleteNotification(notificationId) {
    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification.id !== notificationId
      )
    );
    setLastActivity(getUnixTime(new Date()));
  }

  function saveNotification() {
    const userRef = doc(db, 'users', userData?.email);
    console.log(notifications);
    updateDoc(userRef, {
      lastLogout: getUnixTime(new Date()),
      notifications: [...notifications],
    });
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        const unsubscribe = onSnapshot(doc(db, 'users', user?.email), (doc) => {
          setLastActivity(doc.data()?.lastLogout);
          setUserData(doc.data());
        });
        return () => {
          saveNotification;
          unsubscribe();
        };
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user && userData?.scenes?.length >= 1) {
      const userScenes = [];
      const processedNotifications = new Set();

      userData?.scenes?.forEach((scene) => {
        userScenes.push(scene.id);
      });

      notifications &&
        setNotifications(
          notifications?.filter((noti) => userScenes?.includes(noti?.sceneId))
        );

      const ScenesUnsubscribe = onSnapshot(
        query(collection(db, 'scenes'), where('id', 'in', userScenes)),
        (querySnapshot) => {
          const scenesTmp = [];

          querySnapshot.forEach((doc) => {
            scenesTmp.push(doc.data());
          });

          querySnapshot.docChanges().forEach((change) => {
            const sceneData = change.doc.data();
            const sceneId = change.doc.data().id;

            if (change.type === 'added' || change.type === 'modified') {
              sceneData.history.forEach((historyItem) => {
                if (historyItem.date > lastActivity) {
                  const uniqueKey = `${sceneId}-todo`;
                  if (!processedNotifications.has(uniqueKey)) {
                    processedNotifications.add(uniqueKey);
                    const notification = {
                      id: uniqueKey,
                      type: 'historyChange',
                      sceneId: sceneId,
                      timestamp: historyItem.date,
                    };
                    setNotifications((prev) => [...prev, notification]);

                    if (historyItem.date > lastActivity) {
                      setLastActivity(historyItem.date);
                    }
                  }
                }
              });
            }
          });
          setScenes(scenesTmp);
        }
      );
      const messagesUnsubscribe = onSnapshot(
        query(collection(db, 'messages'), where('id', 'in', userScenes)),
        (querySnapshot) => {
          const messagesTmp = [];
          querySnapshot.forEach((doc) => {
            messagesTmp.push(doc.data());
          });
          querySnapshot.docChanges().forEach((change) => {
            const messageData = change.doc.data();
            const sceneId = change.doc.data().id;
            messageData.messages.forEach((message) => {
              if (
                change.type === 'added' &&
                message.timestamp > userData.lastLogout
              ) {
                const uniqueKey = `${sceneId}-message`;
                if (!processedNotifications.has(uniqueKey)) {
                  processedNotifications.add(uniqueKey);
                  const notification = {
                    id: uniqueKey,
                    type: 'newMessage',
                    sceneId: sceneId,
                    timestamp: message.timestamp,
                  };
                  setNotifications((prev) => [...prev, notification]);

                  if (message.date > lastActivity) {
                    setLastActivity(message.timestamp);
                  }
                }
              }
            });
          });
          setMessages(messagesTmp);
        }
      );

      return () => {
        ScenesUnsubscribe();
        messagesUnsubscribe();
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
      value={{
        user,
        userData,
        currentScene,
        scenes,
        messages,
        notifications,
        setSceneId,
        deleteNotification,
        saveNotification,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useCtx() {
  return useContext(Context);
}
