'use client';
import { v4 as uuidv4 } from 'uuid';

import { useRef, useState } from 'react';
import SearchComponent from './SearchComponent';
import { writeBatch, doc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/app/Loading';

function NewScene() {
  const { user } = useAuth();
  const router = useRouter();
  const nameRef = useRef();
  const [isMod, setIsMod] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [loading, setLoading] = useState();
  const [users, setUsers] = useState();

  if (!user) {
    return <Loading />;
  }

  async function updateMultipleUsersAndCreateScene(userUpdates, id) {
    try {
      const batch = writeBatch(db);

      const data = {
        scenes: arrayUnion({
          name: nameRef?.current?.value,
          id: id,
        }),
      };

      userUpdates?.forEach(({ email }) => {
        const userDocRef = doc(db, 'users', email);
        batch.update(userDocRef, data);
      });

      const userDocRef = doc(db, 'users', user.email);
      batch.update(userDocRef, data);

      const sceneData = {
        name: nameRef?.current?.value,
        id: id,
        administratorEmail: user.email,
        todos: [],
        modApproval: isMod,
        userCanCreate: isCreate,
      };

      const sceneDocRef = doc(db, 'scenes', id);
      batch.set(sceneDocRef, sceneData);

      // Commit the batch write
      await batch.commit();

      toast.success('Színtér létrehozva');
      setLoading(false);
      router.push(`/szinterek/${id}`);
    } catch (error) {
      toast.error('Hiba történt!');
      setLoading(false);
    }
  }

  function submitForm(e) {
    setLoading(true);
    e.preventDefault();
    const id = uuidv4();
    updateMultipleUsersAndCreateScene(users, id);
  }

  return (
    <div className='max-w-md transition-transform w-full bg-white p-8 rounded-lg shadow-xl space-y-4 mx-auto '>
      <form onSubmit={submitForm}>
        <h1 className='text-2xl font-bold mb-4'>Színtér létrehozása</h1>
        <div className='mb-4'>
          <label className='block text-sm font-medium '>Színtér neve*</label>
          <input
            required
            type='text'
            ref={nameRef}
            className='input input-bordered input-primary mt-1 p-2 w-full border rounded'
          />
        </div>
        <SearchComponent setUsers={setUsers} userEmail={user.email} />
        <div className='w-full mt-5  '>
          <label className='flex items-center label justify-start cursor-pointer'>
            <input
              type='checkbox'
              checked={isMod}
              onChange={() => setIsMod(!isMod)}
              className='checkbox checkbox-primary'
            />
            <span className='label-text pl-5'>Moderátor általi jóváhagyás</span>
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
          <button disabled={loading} type='submit' className='btn btn-primary'>
            Létrehozás
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewScene;