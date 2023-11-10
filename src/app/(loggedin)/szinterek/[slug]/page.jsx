import TodoHolder from '@/components/scenes/TodoHolder';
import sceneLayout from './layout';

function Page() {
  return (
    <div className='flex gap-10 flex-row'>
      <TodoHolder />
      <TodoHolder />
      <TodoHolder />
    </div>
  );
}

export default Page;
