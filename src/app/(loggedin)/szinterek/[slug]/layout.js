import RightSideBar from '@/components/navigation/RightSideBar';

export default function sceneLayout({ children }) {
  return (
    <RightSideBar>
      <div className='min-w-100 min-h-full'>{children}</div>
    </RightSideBar>
  );
}
