import LeftSideBar from '@/components/navigation/LeftSideBar';
import '@/styles/globals.css';
import { Suspense } from 'react';
import Loading from './Loading';
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
          <Suspense fallback={<Loading />}>
            <div className='h-full w-full flex items-center justify-center bg-base-200'>
              {children}
            </div>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
