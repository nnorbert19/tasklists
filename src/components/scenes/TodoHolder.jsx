'use client';
import { useState } from 'react';

function TodoHolder() {
  const [showExtraContainer, setShowExtraContainer] = useState(true);

  return (
    <div className='flex justify-start w-full h-full'>
      <div className='w-full gap-1 md:flex md:flex-row md:gap-1 text-center'>
        {/* To Do Container */}
        <div className='w-full h-80 mx-2 bg-white p-4 rounded-lg shadow-xl'>
          <h3 className=' font-semibold mb-2'>Elkészítendő</h3>
          {/* Add your To Do tasks here */}
        </div>

        {/* Doing Container */}
        <div className='w-full mx-2 bg-white p-4 rounded-lg shadow-xl'>
          <h3 className='font-semibold mb-2'>Folyamatban</h3>
          {/* Add your Doing tasks here */}
        </div>

        {showExtraContainer && (
          <div className='w-full mx-2 bg-white p-4 rounded-lg shadow-xl'>
            <h3 className='font-semibold mb-2'>Jóváhagyásra vár</h3>
            {/* Add your Extra tasks here */}
          </div>
        )}

        {/* Completed Container */}
        <div className='w-full mx-2 bg-white p-4 rounded-lg shadow-xl'>
          <h3 className='font-semibold mb-2'>Kész</h3>
          {/* Add your Completed tasks here */}
        </div>
      </div>
    </div>
  );
}

export default TodoHolder;
