function TodoHolder({ scene }) {
  const showExtraContainer = scene?.modApproval || false;

  return (
    <div className='flex justify-center w-full h-full overflow-hidden'>
      <div className='w-full flex flex-wrap gap-1 text-center'>
        {/* To Do Container */}
        <div className='flex-auto w-64 h-72 mx-2 bg-white p-4 rounded-lg shadow-xl'>
          <h3 className=' font-semibold mb-2'>Elkészítendő</h3>
          {/* Add your To Do tasks here */}
        </div>

        {/* Doing Container */}
        <div className='flex-auto w-64 h-72 mx-2 bg-white p-4 rounded-lg shadow-xl'>
          <h3 className='font-semibold mb-2'>Folyamatban</h3>
          {/* Add your Doing tasks here */}
        </div>

        {showExtraContainer && (
          <div className='flex-auto w-64 h-72 mx-2 bg-white p-4 rounded-lg shadow-xl'>
            <h3 className='font-semibold mb-2'>Jóváhagyásra vár</h3>
            {/* Add your Extra tasks here */}
          </div>
        )}

        {/* Completed Container */}
        <div className='flex-auto w-64 h-72 mx-2 bg-white p-4 rounded-lg shadow-xl'>
          <h3 className='font-semibold mb-2'>Kész</h3>
          {/* Add your Completed tasks here */}
        </div>
      </div>
    </div>
  );
}

export default TodoHolder;
