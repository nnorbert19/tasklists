import { useState } from 'react';
import SearchComponent from '../SearchComponent';

function NewTodo({ scene }) {
  console.log(scene.users);
  const [users, setUsers] = useState();
  //disabledDays={{ before: new Date() }}
  function submitForm() {}
  return (
    <>
      <div className='flex justify-center py-6 md:pb-4'>
        <button
          className='btn btn-primary'
          onClick={() => document.getElementById('newTodoModal').showModal()}
        >
          Teendő hozzáadása
        </button>
      </div>
      <dialog id='newTodoModal' className='modal'>
        <div className='modal-box'>
          <form onSubmit={submitForm}>
            <h1 className='text-2xl font-bold mb-4'>Teendő létrehozása</h1>
            <div className='mb-4'>
              <label className='block text-sm font-medium '>Teendő neve*</label>
              <input
                required
                type='text'
                //ref={nameRef}
                className='input input-bordered input-primary mt-1 p-2 w-full border rounded'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-1'>
                Részletes leírás
              </label>
              <textarea
                placeholder='Bio'
                className='textarea textarea-bordered textarea-primary textarea-xs w-full '
              ></textarea>
            </div>
            <SearchComponent setUsers={setUsers} filterFrom={scene.users} />

            <div className='m-0 mt-5 flex justify-center'>
              <button //disabled={loading}
                type='submit'
                className='btn btn-primary'
              >
                Létrehozás
              </button>
            </div>
          </form>

          <form method='dialog' className='m-2 flex justify-center'>
            {/* if there is a button in form, it will close the modal */}
            <button className='btn btn-secondary btn-xs '>Mégsem</button>
          </form>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>Mégsem</button>
        </form>
      </dialog>
    </>
  );
}

export default NewTodo;
