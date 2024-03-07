import Loading from '@/app/loading';
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
    if (confirm(`Biztos ki szeretnéd törölni ezt a feladatot?`)) {
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
    <div className='w-full'>
      {loading ? (
        <div className='h-56'>
          <Loading />
        </div>
      ) : (
        <>
          {scenes?.map((scene) => (
            <div
              key={scene.id}
              className='card z-10 bg-base-100 shadow-xl m-2 '
            >
              <div className='card-body flex-col lg:flex-row items-center p-4'>
                <div
                  className='tooltip tooltip-bottom lg:tooltip-right max-w-[20rem] z-20 lg:w-40 text-center'
                  data-tip={scene.name}
                >
                  <p className='truncate'>{scene.name}</p>
                </div>
                <div className='flex flex-row'>
                  <p className='text-left lg:text-center'>Adminisztrátor:</p>
                  <div
                    className='tooltip tooltip-bottom max-w-[18rem] lg:w-52 text-left'
                    data-tip={scene.administratorEmail}
                  >
                    <p className='truncate'>{scene.administratorEmail}</p>
                  </div>
                </div>
                <p>
                  Felhasználók:
                  {scene.users?.length ? scene.users.length : '0'}
                </p>
                <div
                  className='tooltip hover:cursor-pointer lg:mr-4'
                  data-tip='Színtér törlése'
                  onClick={() => deleteScene(scene)}
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
                      d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default ScenesLister;
