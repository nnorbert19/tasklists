/* eslint-disable react-hooks/exhaustive-deps */
import UserComponent from './UserComponent';
import Avatar from '../user/Avatar';
import { db } from '@/lib/firebase';
import { toast } from 'react-toastify';
import { getUnixTime } from 'date-fns';
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import SearchComponent from '../SearchComponent';
import { useEffect, useState } from 'react';

function UserLister({ users, userIsAdmin, userEmail, sceneId, displayName }) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersToFilter, setUsersToFilter] = useState();
  const [loading, setLoading] = useState();

  function toggleModal() {
    document.getElementById('userModal').showModal();
  }

  useEffect(() => {
    if (userIsAdmin) {
      getUsers();
    }
  }, []);

  async function getUsers() {
    const querySnapshot = await getDocs(collection(db, 'users'));
    let userData = [];
    querySnapshot.forEach((doc) => {
      userData.push(doc.data());
    });

    const usersWithoutexisting = userData.filter(
      (user) => !users.some((existingUser) => existingUser.email === user.email)
    );

    setUsersToFilter(usersWithoutexisting);
  }

  async function addUsers() {
    try {
      const batch = writeBatch(db);

      const data = {
        scenes: arrayUnion({
          id: sceneId,
        }),
      };

      let userData = [];

      selectedUsers?.forEach((user) => {
        userData.push({
          email: user.email,
          displayName: user.displayName,
          photoUrl: user?.photoUrl,
        });
        const userDocRef = doc(db, 'users', user.email);
        batch.update(userDocRef, data);
      });

      const sceneData = {
        users: arrayUnion(...userData),
        history: arrayUnion({
          type: 'usersAdded',
          date: getUnixTime(new Date()),
          user: displayName,
          addedUsers: userData,
        }),
      };
      const messagesDocRef = doc(db, 'messages', sceneId);

      batch.update(messagesDocRef, { users: arrayUnion(...userData) });
      const sceneDocRef = doc(db, 'scenes', sceneId);
      batch.update(sceneDocRef, sceneData);

      // Commit the batch write
      await batch.commit();

      setSelectedUsers([]);
      getUsers();
      toast.success('Felhasználók hozzáadva');
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      toast.error('Hiba történt!');
      setLoading(false);
    }
  }

  function kickUser(user) {
    if (
      confirm(
        `Biztos el szeretnéd távolítani ${user.displayName} felhasználót?`
      )
    )
      deleteUser(user, 'kick');
  }

  function leaveScene(user) {
    if (confirm(`Biztos ki szeretnél lépni a színtérből?`))
      deleteUser(user, 'leave');
  }

  async function deleteUser(user, type) {
    try {
      const batch = writeBatch(db);
      batch.update(doc(db, 'messages', sceneId), {
        users: arrayRemove(user),
      });
      batch.update(doc(db, 'scenes', sceneId), {
        users: arrayRemove(user),
      });
      batch.update(doc(db, 'users', user.email), {
        scenes: arrayRemove({ id: sceneId }),
      });
      await batch.commit();

      if (type === 'leave') {
        toast.success('Sikeresen kiléptél a színtérből', {
          autoClose: 5000,
        });
      } else {
        toast.success('Felhasználó sikeresen eltávolítva.', {
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error(error.message);
      toast.error('Hiba történt.');
    }
  }

  return (
    <>
      <dialog id='userModal' className='modal'>
        <div className='modal-box'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          <div className='overflow-x-hidden px-3'>
            {users.map((user) => (
              <div
                key={user.email}
                className='card w-50 border bg-base-100 shadow-xl m-2 '
              >
                <div className='card-body flex-col lg:flex-row items-center p-4'>
                  <div className='w-10 rounded-full mr-1'>
                    <Avatar photoUrl={user.photoUrl} />
                  </div>
                  <p>{user.displayName}</p>
                  <p>{user.email}</p>
                  {userEmail === user.email && (
                    <div className='card-actions justify-end items-center duration-100 hover:scale-110 z-10'>
                      <div className='tooltip' data-tip='Kilépés'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='w-6 h-6 hover:cursor-pointer'
                          onClick={() => leaveScene(user)}
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9'
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                  {userIsAdmin && userEmail !== user.email && (
                    <div className='card-actions justify-end items-center duration-100 hover:scale-110 z-10'>
                      <div className='tooltip' data-tip='Eltávolítás'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='w-6 h-6 hover:cursor-pointer'
                          onClick={() => kickUser(user)}
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M6 18L18 6M6 6l12 12'
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {userIsAdmin && (
            <div className='flex flex-col items-center'>
              <SearchComponent
                selectedUser={selectedUsers ? selectedUsers : undefined}
                setUsers={setSelectedUsers}
                filterFrom={usersToFilter}
              />
              <button
                className='btn btn-primary'
                disabled={loading || selectedUsers?.length === 0}
                onClick={() => addUsers()}
              >
                Hozzáadás
              </button>
            </div>
          )}
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>Bezárás</button>
        </form>
      </dialog>
      <div className='bg-base-200 h-56 w-100 p-1 pb-2 mt-2 border-base-100 rounded-lg text-center'>
        <p className='font-medium'>Felhasználók:</p>
        <ul
          role='list'
          className='divide-y overflow-hidden divide-base-300 h-40 dark:divide-gray-700 text-left'
        >
          {users.map((user) => (
            <li key={user.email} className='py-1 sm:py-2 overflow-hidden'>
              <UserComponent withEmail user={user} />
            </li>
          ))}
        </ul>
        <button
          className='btn btn-secondary btn-xs m-auto'
          onClick={() => toggleModal()}
        >
          Felhasználók listázása
        </button>
      </div>
    </>
  );
}

export default UserLister;
