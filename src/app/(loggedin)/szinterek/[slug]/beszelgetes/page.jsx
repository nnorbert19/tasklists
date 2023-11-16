'use client';
import { useCtx } from '@/context/Context';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Loading from '@/app/Loading';
import MessagesHolder from '@/components/messages/MessagesHolder';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function Page() {
  const { user, setSceneId, currentScene } = useCtx();
  const pathname = usePathname();
  const parts = pathname.split('/');
  const id = parts[parts.length - 2];
  const [loading, setLoading] = useState(true);
  const [messagesData, setMessagesData] = useState();

  useEffect(() => {
    setSceneId(id);
  }, [user]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'messages', id), (doc) => {
      setMessagesData(doc.data());
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className='min-h-screen max-h-screen w-100 flex justify-center items-center flex-wrap overflow-y-auto overflow-x-hidden'>
      {loading ? <Loading /> : <MessagesHolder messagesData={messagesData} />}
    </div>
  );
}

export default Page;
