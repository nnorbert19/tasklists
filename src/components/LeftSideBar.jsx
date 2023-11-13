'use client';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import Avatar from './user/Avatar';
import Link from 'next/link';
import { doc, onSnapshot } from 'firebase/firestore';
import { useCtx } from '@/context/Context';

function LeftSideBar({ children }) {
  const { user } = useCtx();
  const [isOpen, setIsOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [scenes, setScenes] = useState();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, 'users', user?.email), (doc) => {
        setScenes(doc.data()?.scenes);
      });

      return unsub;
    }
  }, [user]);

  async function logout() {
    await signOut(auth);
    const response = await fetch('/api/signout', {
      method: 'POST',
    });
    if (response.status === 200) {
      router.push('/bejelentkezes');
    }
  }
  //if (!user) return;

  return (
    <>
      <div className='drawer lg:drawer-open'>
        <input id='left-sidebar' type='checkbox' className='drawer-toggle' />
        <div className='h-full drawer-content flex flex-col items-center justify-center'>
          {/* Page content here */}
          {children}
          <label
            htmlFor='left-sidebar'
            className='btn btn-circle fixed top-0 left-0 m-4'
          >
            <svg
              className='swap-off fill-current'
              xmlns='http://www.w3.org/2000/svg'
              width='32'
              height='32'
              viewBox='0 0 512 512'
            >
              <path d='M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z' />
            </svg>
          </label>
        </div>
        <div className='drawer-side'>
          <label
            htmlFor='left-sidebar'
            aria-label='close sidebar'
            className='drawer-overlay'
          ></label>
          <ul className='menu sticky w-48 min-h-full bg-primary text-base-content'>
            {/* tartalom */}
            <div className='h-full  w-full flex justify-start items-center flex-col overflow-hidden'>
              <div className={`w-24 duration-500 ease-in-out`}>
                <Link href={'/profil'}>
                  <Avatar photoUrl={user?.photoURL} />
                </Link>
              </div>
              <Link
                href={'/kezdolap'}
                className={`mt-10 ${
                  pathname === '/kezdolap'
                    ? 'bg-secondary-focus rounded-md'
                    : ''
                }  w-full flex flex-row items-center gap-x-4 hover:bg-secondary-focus rounded-md `}
              >
                <span className='block float-left'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className={`w-10 h-10 duration-500`}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
                    />
                  </svg>
                </span>
                <span className={` duration-500 font-medium px-2`}>
                  Kezdőlap
                </span>
              </Link>
              <Link
                href={'/profil'}
                className={`mt-5 ${
                  pathname === '/profil' ? 'bg-secondary-focus rounded-md' : ''
                }  w-full flex flex-row items-center gap-x-4 hover:bg-secondary-focus rounded-md`}
              >
                <span className='block float-left'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className={`w-10 h-10 duration-500 `}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                </span>
                <span className={` duration-500 font-medium  px-2`}>
                  Profil
                </span>
              </Link>
              <Link
                href={'/feladataim'}
                className={`mt-10 ${
                  pathname === '/feladataim'
                    ? 'bg-secondary-focus rounded-md'
                    : ''
                }  w-full flex flex-row items-center gap-x-4 hover:bg-secondary-focus rounded-md`}
              >
                <span className='block float-left'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className={`w-10 h-10 duration-500`}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184'
                    />
                  </svg>
                </span>
                <span className={` duration-500 font-medium  px-2`}>
                  Feladataim
                </span>
              </Link>
              <div
                className={`mt-5 ${
                  pathname === '/szinterek'
                    ? 'bg-secondary-focus rounded-md'
                    : ''
                }  w-full flex flex-row items-center gap-x-4 hover:bg-secondary-focus rounded-md`}
              >
                <Link
                  href={'/szinterek'}
                  className='flex w-full flex-row items-center gap-x-4 '
                >
                  <span className='block float-left'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className={`w-10 h-10 duration-500 `}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776'
                      />
                    </svg>
                  </span>
                  <span className={` duration-500 font-medium flex-1 px-2`}>
                    színterek
                  </span>
                </Link>
                <label
                  className={`swap swap-rotate ml-[auto] hover:bg-secondary-focus`}
                >
                  <input
                    type='checkbox'
                    onClick={() => setSubmenuOpen(!submenuOpen)}
                  />

                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='swap-on w-6 h-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M4.5 15.75l7.5-7.5 7.5 7.5'
                    />
                  </svg>

                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='swap-off w-6 h-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M19.5 8.25l-7.5 7.5-7.5-7.5'
                    />
                  </svg>
                </label>
              </div>
              {submenuOpen && (
                <>
                  <ul
                    className={` py-2 duration-500 overflow-auto w-46 max-h-28  `}
                  >
                    {scenes?.length >= 1 &&
                      scenes?.map((scene) => (
                        <li key={scene?.id} className=' truncate max-w-10'>
                          <Link href={`/szinterek/${scene?.id}`}>
                            <p className=' truncate max-w-10'>{scene?.name}</p>
                          </Link>
                        </li>
                      ))}
                  </ul>
                  <button className='btn btn-xs btn-neutral'>
                    <Link href={'/szinter-letrehozasa'}>
                      Színtér létrehozása
                    </Link>
                  </button>
                </>
              )}

              <a
                onClick={() => logout()}
                className={`absolute bottom-0 pb-2 w-full flex flex-row items-center gap-x-4 hover:bg-secondary-focus rounded-md cursor-pointer`}
              >
                <span className='block float-left'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className={`'w-10 h-10
                     duration-500 `}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9'
                    />
                  </svg>
                </span>
                <span className={` duration-500 font-medium px-2`}>
                  Kijelentkezés
                </span>
              </a>
            </div>
          </ul>
        </div>
      </div>
    </>
  );
}

export default LeftSideBar;
