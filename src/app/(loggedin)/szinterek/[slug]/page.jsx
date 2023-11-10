import TodoHolder from '@/components/scenes/TodoHolder';
import sceneLayout from './layout';
import NewTodo from '@/components/scenes/NewTodo';

function Page() {
  return (
    <div className='h-100 w-100 flex justify-center content-center flex-wrap'>
      <NewTodo />
      <TodoHolder />
    </div>
  );
}

export default Page;
