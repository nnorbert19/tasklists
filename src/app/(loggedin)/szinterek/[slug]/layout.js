import Loading from '@/app/Loading';
import RightSideBar from '@/components/RightSideBar';

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function sceneLayout({ children }) {
  return (
    <>
      <RightSideBar>
        <div className='min-w-100 min-h-full'>{children}</div>
      </RightSideBar>
    </>
  );
}
