'use client';
import { useCtx } from '@/context/Context';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

function Page() {
  const { user, setSceneId, currentScene } = useCtx();
  const pathname = usePathname();
  const parts = pathname.split('/');
  const id = parts[parts.length - 2];
  const [loading, setLoading] = useState(true);

  console.log(currentScene);
  useEffect(() => {
    setSceneId(id);
    setLoading(false);
  }, [user]);

  return (
    <div className='min-h-screen max-h-screen w-100 flex justify-center items-center flex-wrap overflow-y-auto overflow-x-hidden'>
      Enter
    </div>
  );
}

export default Page;
