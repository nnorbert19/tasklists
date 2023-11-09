'use client';
import { v4 as uuidv4 } from 'uuid';

import { useRef, useState } from 'react';
import SearchComponent from './SearchComponent';
import { writeBatch, doc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function NewScene({ user }) {
  const nameRef = useRef();
  const [isMod, setIsMod] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [loading, setLoading] = useState();
  const [users, setUsers] = useState();

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

      console.log('Multiple users updated successfully!');
      setLoading(false);
    } catch (error) {
      console.error('Error updating multiple users:', error);
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
    <div className='card max-w-xl  bg-base-100 shadow-xl sm:w-full'>
      <h2 className='card-title mt-3 justify-center text-4xl mb-5'>
        Színtér létrehozása
      </h2>
      <div className='card-body gap-10 '>
        <form onSubmit={submitForm}>
          <div className='form-control  w-full px-4'>
            <label className='label'>
              <span className='label-text'>Színtér neve</span>
            </label>
            <input
              required
              type='text'
              ref={nameRef}
              className={`input input-bordered input-primary w-50 max-w-xs`}
            />
          </div>
          <SearchComponent setUsers={setUsers} userEmail={user.email} />
          <div className='form-control w-full mt-5  px-4'>
            <label className='label justify-start cursor-pointer'>
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
          <div className='form-control w-full px-4'>
            <label className='label justify-start cursor-pointer'>
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
              disabled={loading}
              type='submit'
              className='btn btn-primary'
            >
              Létrehozás
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewScene;
