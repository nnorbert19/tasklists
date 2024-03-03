'use client';
import Loading from '@/app/loading';
import { useCtx } from '@/context/Context';
import { usePathname, useRouter } from 'next/navigation';
import HistoryLister from '../scenes/HistoryLister';
import UserLister from '../scenes/UserLister';
import EditScene from '../scenes/EditScene';

function RightSideBar({ children }) {
  const { currentScene, sceneLoading, userData } = useCtx();
  const userIsAdmin = currentScene?.administratorEmail == userData?.email;
  const router = useRouter();

  const pathname = usePathname();
  const parts = pathname.split('/');
  const id = currentScene?.id;

  if (!currentScene) return <>{children};</>;

  return (
    <div className='drawer drawer-end lg:drawer-open'>
      <input id='right-sidebar' type='checkbox' className='drawer-toggle' />
      <div className='h-full drawer-content'>
        {/* oldal*/}
        {children}
        {/* Mobil gomb */}
        <label
          htmlFor='right-sidebar'
          className='btn btn-circle fixed top-0 right-0 m-4'
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
          htmlFor='right-sidebar'
          aria-label='close sidebar'
          className='drawer-overlay'
        ></label>
        <ul
          className={`${
            sceneLoading ? 'justify-center' : 'justify-start'
          } flex align-center content-center flex-wrap flex-col pt-4 w-48 min-h-full bg-primary text-base-content`}
        >
          {/* tartalom */}
          {sceneLoading && (
            <div className='mx-auto'>
              <Loading />
            </div>
          )}
          {!sceneLoading && currentScene && (
            <div className='flex justify-start items-center flex-col  overflow-hidden'>
              <li>
                <h2 className='text-xl font-medium pb-4 truncate max-w-[180px]'>
                  {currentScene?.name}
                </h2>
              </li>
              {parts[parts.length - 1] == 'beszelgetes' ? (
                <li>
                  <button
                    className='btn btn-neutral'
                    onClick={() => router.push(`/szinterek/${id}`)}
                  >
                    Feladatok
                  </button>
                </li>
              ) : (
                <li>
                  <button
                    className='btn btn-neutral'
                    onClick={() => router.push(pathname + '/beszelgetes')}
                  >
                    Beszélgetés
                  </button>
                </li>
              )}
              <li>
                <UserLister
                  users={currentScene?.users}
                  userIsAdmin={userIsAdmin}
                  userEmail={userData?.email}
                  sceneId={currentScene?.id}
                  displayName={userData?.displayName}
                  sceneName={currentScene?.name}
                />
              </li>
              <li>
                <HistoryLister history={currentScene?.history} />
              </li>
              {userIsAdmin && <EditScene currentScene={currentScene} />}
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}

export default RightSideBar;
