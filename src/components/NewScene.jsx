'use client';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useRef, useState } from 'react';
import SearchComponent from './SearchComponent';
import {
  collection,
  getDocs,
  writeBatch,
  doc,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useCtx } from '@/context/Context';
import Loading from '@/app/Loading';
import { getUnixTime } from 'date-fns';

function NewScene() {
  const { userData } = useCtx();
  const router = useRouter();
  const nameRef = useRef();
  const [isMod, setIsMod] = useState(false);
  const [isCreate, setIsCreate] = useState(true);
  const [loading, setLoading] = useState();
  const [users, setUsers] = useState();
  const [usersToFilter, setUsersToFilter] = useState();

  useEffect(() => {
    getUsers();
  }, [userData]);

  if (!userData) {
    return <Loading />;
  }

  async function getUsers() {
    const querySnapshot = await getDocs(collection(db, 'users'));
    let usersData = [];
    querySnapshot.forEach((doc) => {
      usersData.push(doc.data());
    });
    setUsersToFilter(usersData);
  }

  async function updateMultipleUsersAndCreateScene(userUpdates, id) {
    try {
      const batch = writeBatch(db);

      let usersData = [];

      userUpdates?.forEach((user) => {
        usersData.push({
          email: user.email,
          displayName: user.displayName,
          photoUrl: user?.photoUrl,
        });
        const userDocRef = doc(db, 'users', user.email);
        batch.update(userDocRef, {
          scenes: arrayUnion({
            id: id,
          }),
        });
      });

      //létrehozó
      usersData.push({
        email: userData.email,
        displayName: userData.displayName,
        photoUrl: userData?.photoUrl,
      });
      const userDocRef = doc(db, 'users', userData.email);
      batch.update(userDocRef, {
        scenes: arrayUnion({
          id: id,
        }),
      });

      const sceneData = {
        name: nameRef?.current?.value,
        id: id,
        administratorEmail: userData.email,
        todos: [],
        modApproval: isMod,
        userCanCreate: isCreate,
        users: [...usersData],
        history: [
          {
            type: 'created',
            date: getUnixTime(new Date()),
            user: userData.displayName,
          },
        ],
      };

      const messagesData = {
        id: id,
        messages: [],
        users: [...usersData],
      };

      console.log(messagesData);
      console.log(sceneData);

      const messagesDocRef = doc(db, 'messages', id);
      batch.set(messagesDocRef, messagesData);

      const sceneDocRef = doc(db, 'scenes', id);
      batch.set(sceneDocRef, sceneData);

      await batch.commit();

      toast.success('Színtér létrehozva');
      setLoading(false);
      router.push(`/szinterek/${id}`);
    } catch (error) {
      console.error(error.message);
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
    <div className='max-w-md w-full bg-white p-8 rounded-lg shadow-xl space-y-4 mx-auto '>
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
        <SearchComponent setUsers={setUsers} filterFrom={usersToFilter} />
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
