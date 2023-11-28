import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from 'next/navigation';
import { format, fromUnixTime, getUnixTime } from 'date-fns';
import { toast } from 'react-toastify';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import DatePicker from 'react-datepicker';
import SearchComponent from '../SearchComponent';
import UserComponent from './UserComponent';

function Todo({
  data,
  user,
  administrator,
  modApproval,
  userCanCreate,
  scene,
  sceneName,
  showSceneName,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { title, description, deadline, assigned, id, date } = data;

  const sceneId = scene?.id ? scene.id : scene;
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(
    description ? description : ''
  );
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(assigned);
  const [newDate, setNewDate] = useState(
    deadline && fromUnixTime(deadline?.seconds)
  );

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const paramId = searchParams.get('modal');
    if (paramId == id) {
      document.getElementById(id).showModal();
    }
  }, [id, searchParams]);

  function toDoStage(stage) {
    switch (stage) {
      case 'toDo':
        return 'Elkészítendő';
      case 'inProgress':
        return 'Folyamatban';
      case 'ready':
        return 'Kész';

      case 'awaitingApproval':
        return 'Jóváhagyásra vár';

      default:
        return;
    }
  }

  async function deleteTodo(todo) {
    if (confirm(`Biztos ki szeretnéd törölni ezt a teendőt?`)) {
      try {
        await updateDoc(doc(db, 'scenes', sceneId), {
          todos: arrayRemove(todo),
          history: arrayUnion({
            type: 'todoRemoved',
            date: getUnixTime(new Date()),
            user: user.displayName,
            title: data.title,
          }),
        });
        toast.success('Teendő sikeresen törölve!');
      } catch (error) {
        console.error(error.message);
        toast.error('Hiba történt!');
      }
    }
  }

  async function moveTodo(stage) {
    if (stage == 'ready' && modApproval && administrator !== user.email) {
      toast.error('Ehhez nincs joga.');
      return;
    }

    const documentRef = doc(db, 'scenes', sceneId);

    try {
      await updateDoc(documentRef, {
        todos: arrayRemove(data),
      });

      data.stage = stage;

      await updateDoc(documentRef, {
        todos: arrayUnion({
          ...data,
        }),
        history: arrayUnion({
          type: 'todoMoved',
          date: getUnixTime(new Date()),
          user: user.displayName,
          title: data.title,
          to: stage,
        }),
      });
    } catch (error) {
      toast.error('Hiba történt');
      console.error(error.message);
    }

    toast.success('Teendő sikeresen mozgatva');
  }

  function getMoveList() {
    const moveList = [];
    const moveTodoList = [
      { key: 'toDo', value: 'Elkészítendő' },
      { key: 'inProgress', value: 'Folyamatban' },
      { key: 'ready', value: 'Kész' },
    ];
    if (modApproval) {
      moveTodoList.splice(2, 0, {
        key: 'awaitingApproval',
        value: 'Jóváhagyásra vár',
      });
    }

    moveTodoList.forEach((stage) => {
      if (data.stage == stage.key) {
        moveList.push(
          <li className='m-1' key={stage.key}>
            <button disabled className='btn btn-ghost btn-xs'>
              {stage.value}
            </button>
          </li>
        );
      } else {
        moveList.push(
          <li
            onClick={() => moveTodo(stage.key)}
            className='m-1'
            key={stage.key}
          >
            <button className='btn btn-ghost btn-xs'>{stage.value}</button>
          </li>
        );
      }
    });

    return moveList;
  }

  function closeModal() {
    router.replace(pathname);
    setIsEditing(false);
  }

  function basicModalUI() {
    return (
      <div className='flex flex-col items-center text-center min-h-52'>
        {showSceneName && (
          <p className='text-xs font-medium text-gray-500'>{sceneName}</p>
        )}
        <h1 className=' text-gray-500'>{toDoStage(data.stage)}</h1>
        <h1 className='text-2xl font-medium text-gray-900 py-4'>{title}</h1>
        {description && <p className='py-5'>{description}</p>}
        <div className='flex flex-row justify-between w-full pb-3'>
          <div className='w-40'>
            <p className='text-xs font-medium text-gray-500'>létrehozva:</p>
            <p className='text-xs font-medium italic text-gray-500'>
              {format(fromUnixTime(date), 'yyyy/MM/dd HH:MM')}
            </p>
          </div>
          <div className='w-30'>
            {assigned && (
              <>
                <p className='text-xs font-medium text-gray-500'>
                  Hozzárendelt személy:
                </p>
                <UserComponent user={assigned} />
              </>
            )}
          </div>
          <div className='w-40'>
            {deadline && (
              <>
                <p className='text-xs font-medium text-gray-500'>Határidő:</p>
                <p className='text-xs font-medium italic text-gray-500'>
                  {format(fromUnixTime(deadline.seconds), 'yyyy/MM/dd')}
                </p>
              </>
            )}
          </div>
        </div>
        <div>
          <details className='dropdown dropdown-top'>
            <summary className='m-1 btn btn-primary btn-xs'>Mozgatás</summary>
            <ul className='p-2 shadow menu dropdown-content z-[1] bg-base-200 rounded-box w-52'>
              {getMoveList()}
            </ul>
          </details>
          {userCanCreate && (
            <button
              className='btn btn-secondary btn-xs mt-2'
              onClick={() => setIsEditing(true)}
            >
              Módosítás
            </button>
          )}
        </div>
        {administrator == user?.email && (
          <label
            className='btn-xs mt-1 text-blue-700 hover:cursor-pointer'
            onClick={() => deleteTodo(data)}
          >
            Teendő törlése
          </label>
        )}
      </div>
    );
  }

  async function submitForm(e) {
    e.preventDefault();
    if (!userCanCreate) {
      toast.error('Ehhez nincs joga.');
      return;
    }

    const documentRef = doc(db, 'scenes', sceneId);

    try {
      await updateDoc(documentRef, {
        todos: arrayRemove(data),
      });

      await updateDoc(documentRef, {
        todos: arrayUnion({
          id: data.id,
          title: editTitle,
          description: editDescription,
          assigned: selectedUser?.email ? selectedUser : null,
          deadline: newDate ? newDate : null,
          stage: data.stage,
          date: date,
        }),
        history: arrayUnion({
          type: 'todoUpdated',
          date: getUnixTime(new Date()),
          user: user.displayName,
          title: title,
        }),
      });
    } catch (error) {
      toast.error('Hiba történt');
      console.error(error.message);
    }

    toast.success('Teendő sikeresen módosítva');
  }

  function editingModalUI() {
    return (
      <div className='flex flex-col items-center text-center min-h-52'>
        <form onSubmit={submitForm}>
          <h1 className='text-2xl font-bold mb-4'>Teendő módosítása</h1>
          <div className='mb-4'>
            <label className='block text-sm font-medium '>Teendő neve*</label>
            <input
              required
              maxLength='50'
              type='text'
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className='input input-bordered input-primary mt-1 p-2 w-full border rounded'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>
              Részletes leírás
            </label>
            <textarea
              maxLength='256'
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className='textarea textarea-bordered textarea-primary textarea-xs w-full '
            ></textarea>
          </div>
          <SearchComponent
            selectedUser={selectedUser ? [selectedUser] : undefined}
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
              selected={newDate}
              onChange={(date) => setNewDate(date)}
              isClearable
            />
          </div>

          <div className='m-0 mt-5 flex justify-center'>
            <button //disabled={loading}
              type='submit'
              className='btn btn-primary p-2'
            >
              Módosítás
            </button>
            <button //disabled={loading}
              className='btn btn-ghost p-2'
              onClick={() => closeModal()}
            >
              Mégse
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <>
      <dialog id={id} className='modal'>
        <div className='modal-box'>
          {isEditing ? editingModalUI() : basicModalUI()}
        </div>
        <form
          method='dialog'
          className='modal-backdrop'
          onClick={() => closeModal()}
        >
          <button>close</button>
        </form>
      </dialog>
      <div
        className='border-2 rounded-md mb-2 text-left duration-200 hover:scale-110 hover:bg-base-200 cursor-pointer '
        onClick={() =>
          router.push(pathname + '?' + createQueryString('modal', id))
        }
      >
        {showSceneName && (
          <p className='text-xs font-medium text-gray-500'>{sceneName}</p>
        )}
        <div className='flex items-center justify-between px-2 pt-2'>
          <h2 className='text-lg leading-6 font-medium text-gray-900'>
            {title}
          </h2>
        </div>
        <div className='mt-1 flex items-left flex-col justify-between px-2 pb-2'>
          {deadline && (
            <p className='text-xs font-medium text-gray-500'>
              Határidő: {format(fromUnixTime(deadline.seconds), 'yyyy/MM/dd')}
            </p>
          )}
          {assigned && <UserComponent user={assigned} />}
        </div>
      </div>
    </>
  );
}

export default Todo;
