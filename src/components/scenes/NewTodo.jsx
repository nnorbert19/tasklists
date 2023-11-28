import { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import SearchComponent from '../SearchComponent';
import Loading from '@/app/Loading';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, getUnixTime } from 'date-fns';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-toastify';

function NewTodo({ scene, user }) {
  const titleRef = useRef();
  const descriptionRef = useRef();
  const [selectedUser, setSelectedUser] = useState([]);
  const [date, setDate] = useState();

  if (!scene) return <Loading />;

  async function submitForm(e) {
    e.preventDefault();
    const id = uuidv4();
    const todoData = {
      todos: arrayUnion({
        id: id,
        title: titleRef.current.value,
        description: descriptionRef?.current?.value
          ? descriptionRef?.current?.value
          : null,
        assigned: selectedUser?.email ? selectedUser : null,
        deadline: date ? date : null,
        stage: 'toDo',
        date: getUnixTime(new Date()),
      }),
      history: arrayUnion({
        type: 'todoCreate',
        date: getUnixTime(new Date()),
        user: user.displayName,
        title: titleRef.current.value,
      }),
    };

    try {
      const todoDocRef = doc(db, 'scenes', scene.id);

      await updateDoc(todoDocRef, todoData);
    } catch (error) {
      toast.error('Hiba történt');
      console.error(error.message);
    }
    toast.success('Teendő sikeresen hozzáadva!');

    setDate();
    setSelectedUser([]);
    descriptionRef.current.value = '';
    titleRef.current.value = '';
    document.getElementById('newTodoModal').close();
  }

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
      {/*Modal */}
      <dialog id='newTodoModal' className='modal'>
        <div className='modal-box'>
          <form onSubmit={submitForm}>
            <h1 className='text-2xl font-bold mb-4'>Teendő létrehozása</h1>
            <div className='mb-4'>
              <label className='block text-sm font-medium '>Teendő neve*</label>
              <input
                maxLength='50'
                placeholder='Maximum 50 karakter.'
                required
                type='text'
                ref={titleRef}
                className='input input-bordered input-primary mt-1 p-2 w-full border rounded'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-1'>
                Részletes leírás
              </label>
              <textarea
                maxLength='256'
                ref={descriptionRef}
                placeholder='Teendő részletes leírása, maximum 256 karakter.'
                className='textarea textarea-bordered textarea-primary textarea-xs w-full '
              ></textarea>
            </div>
            <SearchComponent
              selectedUser={selectedUser}
              setUsers={setSelectedUser}
              onlyOne
              filterFrom={scene?.users}
            />

            <div className='mb-4'>
              <label className='block text-sm font-medium mb-1'>Határidő</label>
              <DatePicker
                dateFormat='yyyy MMMM dd'
                className='input input-primary'
                minDate={new Date()}
                selected={date}
                onChange={(date) => setDate(date)}
                isClearable
              />
            </div>

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
            {/* modal close button */}
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
