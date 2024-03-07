/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import TodoHolder from '@/components/scenes/TodoHolder';
import NewTodo from '@/components/scenes/NewTodo';
import { useCtx } from '@/context/Context';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import SceneNotFound from '@/components/scenes/SceneNotFound';

function Page() {
  const {
    userData,
    setSceneId,
    currentScene,
    notifications,
    deleteNotification,
  } = useCtx();
  const pathname = usePathname();
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const notificationsForCurrentScene = notifications?.filter(
      (notification) => notification.id === `${id}-todo`
    );
    if (notificationsForCurrentScene) {
      deleteNotification(`${id}-todo`);
    }

    setSceneId(id);
    setLoading(false);
  }, [userData]);

  return (
    <>
      <div className='min-h-screen max-h-screen w-100 flex justify-center items-center flex-wrap overflow-y-auto overflow-x-hidden'>
        {!loading && currentScene && (
          <div className='content-center'>
            {(currentScene.userCanCreate ||
              currentScene.administratorEmail == userData.email) && (
              <NewTodo scene={currentScene} user={userData} />
            )}
            <TodoHolder scene={currentScene} user={userData} />
          </div>
        )}
        {!loading && !currentScene && <SceneNotFound />}
      </div>
    </>
  );
}

export default Page;
