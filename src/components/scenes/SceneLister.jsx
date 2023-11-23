'use client';
import { useCtx } from '@/context/Context';
import Link from 'next/link';
import UserComponent from './UserComponent';

function SceneLister() {
  const { scenes } = useCtx();

  return (
    <div className='max-w-3xl w-full max-h-[80vh] overflow-auto bg-white p-2 rounded-lg shadow-xl space-y-4 mx-auto '>
      <h3 className='text-xl font-medium'>Színtereim</h3>
      {!scenes && <div>Nincs megjeleníthető színtered!</div>}
      {scenes?.map((scene) => (
        <div className='collapse collapse-arrow bg-base-200' key={scene?.id}>
          <input type='radio' name='my-accordion-2' />
          <div className='collapse-title text-xl font-medium'>
            {scene?.name}
          </div>
          <div className='collapse-content gap-2 flex flex-col justify-evenly items-center sm:flex-row'>
            <div className='flex flex-col items-center'>
              Adminisztrátor:
              <UserComponent
                withEmail
                user={scene?.users?.find(
                  (user) => user?.email == scene?.administratorEmail
                )}
              />
            </div>
            <button className='btn btn-neutral btn-xs'>
              <Link href={`/szinterek/${scene?.id}`}>
                <p className=' truncate max-w-10'>Színtér megnyitása</p>
              </Link>
            </button>
          </div>
        </div>
      ))}
      <button className='btn btn-xs btn-neutral'>
        <Link href={'/szinter-letrehozasa'}>Színtér létrehozása</Link>
      </button>
    </div>
  );
}

export default SceneLister;
