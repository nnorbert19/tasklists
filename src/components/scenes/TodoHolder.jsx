'use client';
import { useState } from 'react';

function TodoHolder() {
  const [showExtraContainer, setShowExtraContainer] = useState(true);

  return (
    <div className='flex justify-center'>
      <div className=' p-4'>
        <h2 className='text-xl font-semibold mb-4'>Task Manager</h2>

        {/* To Do Container */}
        <div className='border p-4 mb-4'>
          <h3 className='text-lg font-semibold mb-2'>To Do</h3>
          {/* Add your To Do tasks here */}
        </div>

        {/* Doing Container */}
        <div className='border p-4 mb-4'>
          <h3 className='text-lg font-semibold mb-2'>Doing</h3>
          {/* Add your Doing tasks here */}
        </div>

        {/* Completed Container */}
        <div className='border p-4 mb-4'>
          <h3 className='text-lg font-semibold mb-2'>Completed</h3>
          {/* Add your Completed tasks here */}
        </div>

        {/* Optional Extra Container */}
        {showExtraContainer && (
          <div className='border p-4'>
            <h3 className='text-lg font-semibold mb-2'>Extra Container</h3>
            {/* Add your Extra tasks here */}
          </div>
        )}

        {/* Toggle Extra Container */}
        <button
          onClick={() => setShowExtraContainer(!showExtraContainer)}
          className='mt-4 p-2 bg-blue-500 text-white rounded'
        >
          Toggle Extra Container
        </button>
      </div>
    </div>
  );
}

export default TodoHolder;
