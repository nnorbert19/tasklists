import Todo from './Todo';

function TodoHolder({ scene, user }) {
  const showExtraContainer = scene?.modApproval || false;
  const toDoStage = scene?.todos.filter((todo) => todo?.stage == 'toDo');
  const inProgress = scene?.todos.filter((todo) => todo?.stage == 'inProgress');
  const ready = scene?.todos.filter((todo) => todo?.stage == 'ready');
  const awaitingApproval = scene?.todos.filter(
    (todo) => todo?.stage == 'awaitingApproval'
  );

  return (
    <div className='grid-cols-2 w-full h-full mb-5'>
      <div
        className={`grid ${
          showExtraContainer
            ? 'xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2'
            : 'xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2'
        } gap-3 text-center px-3 `}
      >
        <div className='flex-grow min-w-[200px] h-96 bg-white p-4 rounded-lg shadow-xl overflow-auto'>
          <h3 className=' font-semibold mb-2'>Elkészítendő</h3>
          {toDoStage.map((todo) => (
            <Todo key={todo.id} data={todo} />
          ))}
        </div>

        <div className='flex-grow min-w-[200px] h-96 bg-white p-4 rounded-lg shadow-xl overflow-auto'>
          <h3 className='font-semibold mb-2'>Folyamatban</h3>
          {inProgress.map((todo) => (
            <Todo key={todo.id} data={todo} />
          ))}
        </div>

        {showExtraContainer && (
          <div className='flex-grow min-w-[200px] h-96 bg-white p-4 rounded-lg shadow-xl overflow-auto'>
            <h3 className='font-semibold mb-2'>Jóváhagyásra vár</h3>
            {awaitingApproval.map((todo) => (
              <Todo key={todo.id} data={todo} />
            ))}
          </div>
        )}

        <div className='flex-grow min-w-[200px] h-96 bg-white p-4 rounded-lg shadow-xl overflow-auto'>
          <h3 className='font-semibold mb-2'>Kész</h3>
          {ready.map((todo) => (
            <Todo key={todo.id} data={todo} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TodoHolder;
