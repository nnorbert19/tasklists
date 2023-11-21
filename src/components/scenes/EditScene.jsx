import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function EditScene({ currentScene }) {
  const [isMod, setIsMod] = useState(currentScene?.modApproval);
  const [isCreate, setIsCreate] = useState(currentScene?.userCanCreate);
  const [disabled, setDisabled] = useState(true);
  const [title, setTitle] = useState(currentScene?.name);

  async function submitForm(e) {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'scenes', currentScene.id), {
        name: title,
        modApproval: isMod,
        userCanCreate: isCreate,
      });
      toast.success('Sikeres módosítás!');
    } catch (error) {
      console.error(error.message);
      toast.error('Hiba történt.');
    }
  }

  useEffect(() => {
    if (
      isMod !== currentScene?.modApproval ||
      isCreate !== currentScene?.userCanCreate ||
      title !== currentScene?.name
    )
      setDisabled(false);
  }, [
    isMod,
    isCreate,
    title,
    currentScene?.modApproval,
    currentScene?.userCanCreate,
    currentScene?.name,
  ]);

  function toggleModal() {
    document.getElementById('editSceneModal').showModal();
  }
  return (
    <>
      <dialog id='editSceneModal' className='modal'>
        <div className='modal-box'>
          <form onSubmit={submitForm}>
            <h1 className='text-2xl font-bold mb-4'>Színtér lmódosítása</h1>
            <div className='mb-4'>
              <label className='block text-sm font-medium '>
                Színtér neve*
              </label>
              <input
                required
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='input input-bordered input-primary mt-1 p-2 w-full border rounded'
              />
            </div>
            <div className='w-full mt-5  '>
              <label className='flex items-center label justify-start cursor-pointer'>
                <input
                  type='checkbox'
                  checked={isMod}
                  onChange={() => setIsMod(!isMod)}
                  className='checkbox checkbox-primary'
                />
                <span className='label-text pl-5'>
                  Moderátor általi jóváhagyás
                </span>
              </label>
            </div>
            <div className='w-full '>
              <label className='flex items-center label justify-start cursor-pointer'>
                <input
                  type='checkbox'
                  checked={isCreate}
                  onChange={() => setIsCreate(!isCreate)}
                  className='checkbox checkbox-primary'
                />
                <span className='label-text pl-5'>
                  Tagok teendők létrehozására való joga
                </span>
              </label>
            </div>
            <div className='m-0 mt-5 card-actions justify-center'>
              <button
                disabled={disabled}
                type='submit'
                className='btn btn-primary'
              >
                Módosítás
              </button>
            </div>
          </form>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>Mégse</button>
        </form>
      </dialog>
      <div className='absolute bottom-0 pb-2'>
        <button className='btn btn-xs btn-ghost' onClick={() => toggleModal()}>
          Színtér módosítása
        </button>
      </div>
    </>
  );
}

export default EditScene;
