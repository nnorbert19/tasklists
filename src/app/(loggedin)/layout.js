import LeftSideBar from '@/components/navigation/LeftSideBar';

export default function LoggedInLayout({ children }) {
  return (
    <div className='flex w-full h-full'>
      <LeftSideBar>
        <div className=' xs:pl-0 h-full w-full flex items-center justify-center bg-base-200'>
          {children}
        </div>
      </LeftSideBar>
    </div>
  );
}
