import LeftSideBar from '@/components/navigation/LeftSideBar';
import { Suspense } from 'react';
import Loading from '../loading';

export default function LoggedInLayout({ children }) {
  return (
    <div className='flex w-full h-full'>
      <LeftSideBar>
        <div className=' xs:pl-0 h-full w-full flex items-center justify-center bg-base-200'>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>
      </LeftSideBar>
    </div>
  );
}
