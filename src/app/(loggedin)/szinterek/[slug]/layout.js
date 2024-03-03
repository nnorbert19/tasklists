import Loading from '@/app/loading';
import RightSideBar from '@/components/navigation/RightSideBar';
import { Suspense } from 'react';

export default function sceneLayout({ children }) {
  return (
    <RightSideBar>
      <Suspense fallback={<Loading />}>
        <div className='min-w-full min-h-full'>{children}</div>
      </Suspense>
    </RightSideBar>
  );
}
