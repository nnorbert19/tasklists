import LeftSideBar from '@/components/navigation/LeftSideBar';
import '@/styles/globals.css';
import { Suspense } from 'react';
import Loading from './loading';
import ToastContainerWrapper from '@/components/ToastContainer';
import { Providers } from '@/context/Providers';

export const metadata = {
  title: 'Feladatlistákat kezelő webes alkalmazás',
};

export default function RootLayout({ children }) {
  return (
    <html className='h-full'>
      <body className='h-full w-full flex'>
        <ToastContainerWrapper />
        <Providers>
          <div className='h-full w-full flex items-center justify-center bg-base-200'>
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
        </Providers>
      </body>
    </html>
  );
}
