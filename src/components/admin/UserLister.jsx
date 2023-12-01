import { db } from '@/lib/firebase';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import {
  arrayRemove,
  collection,
  doc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Avatar from '../user/Avatar';
import Loading from '@/app/Loading';
import { toast } from 'react-toastify';
import { useCtx } from '@/context/Context';

function UserLister() {
  const auth = getAuth();
  const { userData } = useCtx();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState();

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const querySnapshot = await getDocs(collection(db, 'users'));
    let usersData = [];
    querySnapshot.forEach((doc) => {
      usersData.push(doc.data());
    });
    setUsers(usersData);
    setLoading(false);
  }

  function sendEmail(user) {
    sendPasswordResetEmail(auth, user.email)
      .then(() => {
        toast.success('E-mail elküldve!');
        setLoading(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoading(false);
        if (error.code == 'auth/invalid-email') {
          toast.error('E-mail cím nem található!');
        } else {
          toast.error('Hiba történt!');
        }
        console.error(errorCode);
        console.error(errorMessage);
      });
  }

  async function deleteUser(user) {
    if (confirm(`Biztos törölni szeretnéd ezt a felhasználót?`)) {
      fetch('api/deleteUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: user.uid }),
      })
        .then((response) => response?.json())
        .then(async (data) => {
          if (data?.error !== null) {
            console.error(data.error.message);
            toast.error('Hiba történt');
          } else {
            try {
              const batch = writeBatch(db);
              user?.scenes?.forEach((scene) => {
                const sceneDocRef = doc(db, 'scenes', scene.id);
                const messagesDocRef = doc(db, 'messages', scene.id);
                batch.update(sceneDocRef, {
                  users: arrayRemove({
                    displayName: user.displayName,
                    email: user.email,
                    photoUrl: user.photoUrl,
                  }),
                });
                batch.update(messagesDocRef, {
                  users: arrayRemove({
                    displayName: user.displayName,
                    email: user.email,
                    photoUrl: user.photoUrl,
                  }),
                });
              });

              batch.delete(doc(db, 'users', user.email));
              await batch.commit();
              toast.success('Felhasználó sikeresen törölve');
              setLoading(true);
              getUsers();
            } catch (error) {
              console.error(error.message);
              toast.error('Hiba történt');
            }
          }
        });
    }
  }

  return (
    <div className='overflow-y-auto overflow-x-hidden w-full'>
      {loading ? (
        <div className='h-56'>
          <Loading />
        </div>
      ) : (
        <table className='table'>
          <thead>
            <tr>
              <th className='text-center'>Név</th>
              <th className='text-center'>E-mail</th>
              <th className='text-center'>Színtereinek száma</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.uid}>
                <td className='flex items-center text-center'>
                  <div className='w-10 rounded-full mr-1'>
                    <Avatar photoUrl={user.photoUrl} />
                  </div>
                  {user.displayName}
                </td>
                <td className='text-center'>{user.email}</td>
                <td className='text-center'>
                  {user.scenes?.length ? user.scenes.length : '0'}
                </td>
                <td className='flex gap-4 mr-2'>
                  {user.email == userData.email ? (
                    <></>
                  ) : (
                    <>
                      <div
                        className='tooltip hover:cursor-pointer'
                        data-tip='Jelszóemlékeztető küldése'
                        onClick={() => sendEmail(user)}
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='w-6 h-6'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75'
                          />
                        </svg>
                      </div>
                      <div
                        className='tooltip hover:cursor-pointer'
                        data-tip='Felhasználó törlése'
                        onClick={() => deleteUser(user)}
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor '
                          className='w-6 h-6'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M6 18L18 6M6 6l12 12'
                          />
                        </svg>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserLister;
