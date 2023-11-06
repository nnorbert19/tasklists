'use client';

import { useRef } from 'react';
import SearchComponent from './SearchComponent';

function NewScene() {
  const nameRef = useRef();
  function submitForm() {}

  return (
    <div className='card max-w-xl  bg-base-100 shadow-xl sm:w-full'>
      <h2 className='card-title mt-3 justify-center text-4xl mb-5'>
        Színtér létrehozása
      </h2>
      <div className='card-body gap-10'>
        <form onSubmit={submitForm}>
          <div className='form-control flex-row w-full p-4'>
            <input
              required
              type='text'
              ref={nameRef}
              //placeholder='pelda@email.com'
              className={`input input-bordered input-primary w-50 max-w-xs`}
            />
            <label className='label'>
              <span className='label-text'>Színtér neve</span>
            </label>
          </div>
          <SearchComponent />
        </form>
      </div>
    </div>
  );
}

export default NewScene;
