import Loading from '@/app/Loading';
import { db } from '@/lib/firebase';
import {
  arrayRemove,
  collection,
  doc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function ScenesLister() {
  const [loading, setLoading] = useState(true);
  const [scenes, setScenes] = useState();

  useEffect(() => {
    getScenes();
  }, []);

  async function getScenes() {
    const querySnapshot = await getDocs(collection(db, 'scenes'));
    let scenesData = [];
    querySnapshot.forEach((doc) => {
      scenesData.push(doc.data());
    });
    setScenes(scenesData);
    setLoading(false);
  }

  async function deleteScene(scene) {
    if (confirm(`Biztos ki szeretnéd törölni ezt a teendőt?`)) {
      const batch = writeBatch(db);
      try {
        batch.delete(doc(db, 'scenes', scene.id));
        batch.delete(doc(db, 'messages', scene.id));

        scene?.users?.forEach((user) => {
          const userDocRef = doc(db, 'users', user.email);
          batch.update(userDocRef, {
            scenes: arrayRemove({
              id: scene.id,
            }),
          });
        });

        await batch.commit();
        setLoading(true);
        getScenes();
      } catch (error) {
        console.error(error.message);
        toast.error('hiba történt');
      }
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
              <th>Név</th>
              <th>Adminisztrátor</th>
              <th>felhasználók száma száma</th>
            </tr>
          </thead>
          <tbody>
            {scenes?.map((scene) => (
              <tr key={scene.id}>
                <td className='flex items-center'>{scene.name}</td>
                <td>{scene.administratorEmail}</td>
                <td className='text-center'>
                  {scene.users?.length ? scene.users.length : '0'}
                </td>
                <td>
                  <div
                    className='tooltip hover:cursor-pointer'
                    data-tip='Színtér törlése'
                    onClick={() => deleteScene(scene)}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ScenesLister;
