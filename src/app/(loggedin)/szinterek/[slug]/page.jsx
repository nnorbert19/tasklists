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
  const { user, setSceneId, currentScene } = useCtx();
  const pathname = usePathname();
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSceneId(id);
    setLoading(false);
  }, [user]);

  console.log(id);

  return (
    <>
      <div className='min-h-screen max-h-screen w-100 flex justify-center items-center flex-wrap overflow-y-auto overflow-x-hidden'>
        {loading && <Loading />}
        {!loading && currentScene && (
          <div className='content-center'>
            <NewTodo scene={currentScene} user={user} />
            <TodoHolder scene={currentScene} user={user} />
          </div>
        )}
        {!loading && !currentScene && <SceneNotFound />}
      </div>
    </>
  );
}

export default Page;
