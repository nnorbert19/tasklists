/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useCtx } from '@/context/Context';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Loading from '@/app/loading';
import MessagesHolder from '@/components/messages/MessagesHolder';

function Page() {
  const { userData, setSceneId, messages, notifications, deleteNotification } =
    useCtx();
  const pathname = usePathname();
  const parts = pathname.split('/');
  const id = parts[parts.length - 2];
  const messagesData = messages?.filter((message) => message.id === id);

  useEffect(() => {
    const notificationsForCurrentScene = notifications?.filter(
      (notification) => notification.id === `${id}-message`
    );
    if (notificationsForCurrentScene) {
      deleteNotification(`${id}-message`);
    }
    setSceneId(id);
  }, [userData]);

  return (
    <div className='min-h-screen max-h-screen w-100 flex justify-center items-center flex-wrap overflow-y-auto overflow-x-hidden'>
      {!messagesData ? (
        <Loading />
      ) : (
        <MessagesHolder messagesData={messagesData[0]} />
      )}
    </div>
  );
}

export default Page;
