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

function UserLister({
  users,
  userIsAdmin,
  userEmail,
  sceneId,
  sceneName,
  displayName,
}) {
  const [selectedUsers, setSelectedUsers] = useState();
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
    setUsersToFilter(userData);
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

      toast.success('Felhasználók hozzáadva');
      setSelectedUsers([]);
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      toast.error('Hiba történt!');
      setLoading(false);
    }
  }

  async function kickUser(user) {
    if (
      confirm(
        `Biztos el szeretnéd távolítani ${user.displayName} felhasználót?`
      )
    ) {
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

        toast.success('Felhasználó sikeresen eltávolítva.', {
          autoClose: 500000,
        });
      } catch (error) {
        console.error(error.message);
        toast.error('Hiba történt.');
      }
    }
  }

  return (
    <>
      <dialog id='userModal' className='modal'>
        <div className='modal-box'>
          <div className='overflow-x-auto px-3'>
            <table className='table px-2'>
              <thead>
                <tr>
                  <th>Profilkép</th>
                  <th>Név</th>
                  <th>E-mail</th>
                  {userIsAdmin && <th></th>}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email}>
                    <td className='w-6 h-6'>
                      <Avatar photoUrl={user.photoUrl} />
                    </td>
                    <td>{user.displayName}</td>
                    <td>{user.email}</td>
                    {userIsAdmin && userEmail !== user.email && (
                      <td>
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
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {userIsAdmin && (
            <>
              <SearchComponent
                selectedUsers={selectedUsers}
                setUsers={setSelectedUsers}
                filterFrom={usersToFilter}
              />
              <button
                className='btn btn-primary'
                disabled={loading}
                onClick={() => addUsers()}
              >
                Hozzáadás
              </button>
            </>
          )}
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
      <div className='bg-base-200 h-56 p-1 pb-2 mt-2 border-base-100 rounded-lg text-center'>
        <p className='font-medium'>Felhasználók:</p>
        <ul
          role='list'
          className='divide-y divide-base-300 h-40 dark:divide-gray-700 text-left overflow-hidden'
        >
          {users.map((user) => (
            <li key={user.email} className='py-1 sm:py-2'>
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
