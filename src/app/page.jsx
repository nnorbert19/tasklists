import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function getUser() {
  const cookieStore = cookies();
  const session = cookieStore?.get('session')?.value;
  if (session) {
    redirect('/kezdolap');
  }
}

async function page() {
  await getUser();
  return (
    <div className='hero min-h-screen bg-base-200'>
      <div className='hero-content text-center'>
        <div className='max-w-md'>
          <h1 className='text-5xl font-bold'>
            Feladatlistákat kezelő webes alkalmazás
          </h1>
          <p className='py-6'>
            Kezelje feladatait könnyen és egyszerűen színterek segítségével, egy
            könnyen kezelhető webes alkalmazásban.
          </p>
          <div className='flex justify-center mt-1 text-bg-info'>
            <Link href={'/bejelentkezes'} className='btn btn-primary'>
              Bejelentkezés
            </Link>
          </div>
          <div className='m-4 card-actions justify-center'>
            <Link href={'/regisztracio'}>
              <button className='btn btn-sm btn-secondary'>
                Új fiók létrehozása
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
