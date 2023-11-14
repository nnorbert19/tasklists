function TodoHolder({ scene }) {
  const showExtraContainer = scene?.modApproval || false;

  //toDo
  //inProgress
  //ready
  //awaitingApproval

  return (
    <div className='grid-cols-2 w-full h-full overflow-hidden'>
      <div
        className={`grid ${
          showExtraContainer
            ? 'xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2'
            : 'xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2'
        } gap-5 text-center`}
      >
        {/* To Do Container */}
        <div className='flex-auto w-56 h-72 bg-white p-4 rounded-lg shadow-xl'>
          <h3 className=' font-semibold mb-2'>Elkészítendő</h3>
          {/* Add your To Do tasks here */}
        </div>

        {/* Doing Container */}
        <div className='flex-auto w-56 sm:w-100 h-72 bg-white p-4 rounded-lg shadow-xl'>
          <h3 className='font-semibold mb-2'>Folyamatban</h3>
          {/* Add your Doing tasks here */}
        </div>

        {showExtraContainer && (
          <div className='flex-auto w-56 h-72 bg-white p-4 rounded-lg shadow-xl'>
            <h3 className='font-semibold mb-2'>Jóváhagyásra vár</h3>
            {/* Add your Extra tasks here */}
          </div>
        )}

        {/* Completed Container */}
        <div className='flex-auto w-56 h-72 bg-white p-4 rounded-lg shadow-xl'>
          <h3 className='font-semibold mb-2'>Kész</h3>
          {/* Add your Completed tasks here */}
        </div>
      </div>
    </div>
  );
}

export default TodoHolder;
