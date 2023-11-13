/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import TodoHolder from '@/components/scenes/TodoHolder';
import NewTodo from '@/components/scenes/NewTodo';
import { useCtx } from '@/context/Context';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { usePathname } from 'next/navigation';
import Loading from '@/app/Loading';
import SceneNotFound from '@/components/scenes/SceneNotFound';

function Page() {
  const { user, getScene, scene, sceneLoading } = useCtx();
  const pathname = usePathname();
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, 'users', user?.email), (doc) => {
        const result = doc.data()?.scenes?.find((scene) => scene.id == id);
        getScene(result);
        setLoading(false);
      });

      return unsub;
    }
  }, [user]);

  return (
    <>
      <div className='min-h-screen w-100 flex justify-center items-center flex-wrap'>
        {sceneLoading && <Loading />}
        {!sceneLoading && scene && (
          <div className='content-center overflow-hidden'>
            <NewTodo scene={scene} />
            <TodoHolder scene={scene} />
          </div>
        )}
        {!sceneLoading && !scene && <SceneNotFound />}
      </div>
    </>
  );
}

export default Page;
