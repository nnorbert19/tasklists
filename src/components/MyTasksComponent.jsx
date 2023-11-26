'use client';
import { useCtx } from '@/context/Context';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Todo from './scenes/Todo';

function MyTasksComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { scenes, userData } = useCtx();
  const [filteredTodos, setFilteredTodos] = useState();
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    toggleActiveClass();
  }, [searchParams]);

  function toggleActiveClass() {
    const queryId = searchParams.get('query');
    if (queryId == 'deadline') {
      filterByDeadline();
      document.getElementById('showDeadline').classList.add('active');
      document.getElementById('showAll').classList.remove('active');
    } else {
      document.getElementById('showDeadline').classList.remove('active');
      document.getElementById('showAll').classList.add('active');
      getTasks();
    }
  }

  function filterByDeadline() {
    setFilteredTodos(
      filteredTodos?.filter((todo) => todo.todo.deadline !== null)
    );
  }

  useEffect(() => {
    toggleActiveClass();
    getTasks();
  }, [scenes]);

  function getTasks() {
    const allTodos = scenes?.flatMap((scene) =>
      scene.todos
        .filter((todo) => todo?.assigned?.email == userData?.email)
        .map((todo) => ({
          scene: scene.id,
          sceneUsers: scene.users,
          userCanCreate: scene.userCanCreate,
          sceneName: scene.name,
          administratorEmail: scene.administratorEmail,
          modApproval: scene.modApproval,
          todo: todo,
        }))
    );
    setFilteredTodos(allTodos);
  }

  return (
    <div className='max-w-3xl w-full max-h-[80vh] overflow-auto bg-white p-2 rounded-lg shadow-xl flex flex-col items-center'>
      <h3 className='text-xl font-medium pb-4'>Teendőim</h3>
      <div className='flex flex-col items-center'>
        Rendezés:
        <ul className='menu menu-horizontal gap-1 bg-base-200 rounded-box'>
          <li>
            <a id='showAll' onClick={() => router.push(pathname)}>
              Összes
            </a>
          </li>
          <li>
            <a
              id='showDeadline'
              onClick={() =>
                router.push(
                  pathname + '?' + createQueryString('query', 'deadline')
                )
              }
            >
              Határidős
            </a>
          </li>
        </ul>
      </div>
      {!filteredTodos && <p>Nincs megjeleníthető teendő!</p>}
      <div className='flex flex-row flex-wrap p-2 gap-2'>
        {filteredTodos?.map((todo) => (
          <Todo
            showSceneName
            sceneName={todo.sceneName}
            key={todo.id}
            data={todo.todo}
            user={userData}
            scene={todo.scene}
            administrator={todo.scene.administratorEmail}
            modApproval={todo.scene.modApproval}
            userCanCreate={todo.scene.userCanCreate}
          />
        ))}
      </div>
    </div>
  );
}

export default MyTasksComponent;
