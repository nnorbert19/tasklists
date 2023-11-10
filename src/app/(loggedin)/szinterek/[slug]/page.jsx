'use client';
import TodoHolder from '@/components/scenes/TodoHolder';
import NewTodo from '@/components/scenes/NewTodo';
import { useAuth } from '@/context/AuthContext';

function Page() {
  const user = useAuth();
  return (
    <div className='h-100 w-100 flex justify-center content-center flex-wrap'>
      <NewTodo />
      <TodoHolder />
    </div>
  );
}

export default Page;
