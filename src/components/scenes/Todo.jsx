import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from 'next/navigation';
import { format, fromUnixTime } from 'date-fns';

function Todo({ data }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { title, description, deadline, assigned, id, date } = data;

  const moveTodoList = [{}];

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const paramId = searchParams.get('modal');
    if (paramId == id) {
      document.getElementById(id).showModal();
    }
  }, [id, searchParams]);

  return (
    <>
      <dialog id={id} className='modal'>
        <div className='modal-box'>
          <div className='flex flex-col items-center text-center min-h-52'>
            <h1 className='text-2xl font-medium text-gray-900 py-4'>{title}</h1>
            {description && <p className='py-5'>{description}</p>}
            <div className='flex flex-row justify-between w-full pb-3'>
              <div className='w-40'>
                <p className='text-xs font-medium text-gray-500'>létrehozva:</p>
                <p className='text-xs font-medium italic text-gray-500'>
                  {format(fromUnixTime(date.seconds), 'yyyy/MM/dd HH:MM')}
                </p>
              </div>
              <div className='w-40'>
                {assigned && (
                  <>
                    <p className='text-xs font-medium text-gray-500'>
                      Hozzárendelt személy:
                    </p>
                    <p className='text-xs font-medium italic text-gray-500'>
                      {assigned.displayName}
                    </p>
                  </>
                )}
              </div>
              <div className='w-40'>
                {deadline && (
                  <>
                    <p className='text-xs font-medium text-gray-500'>
                      Határidő:
                    </p>
                    <p className='text-xs font-medium italic text-gray-500'>
                      {deadline}
                    </p>
                  </>
                )}
              </div>
            </div>
            <details className='dropdown dropdown-top dropdown-hover'>
              <summary className='m-1 btn btn-primary'>Mozgatás</summary>
              <ul className='p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52'>
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
              </ul>
            </details>
          </div>
        </div>
        <form
          method='dialog'
          className='modal-backdrop'
          onClick={() => router.replace(pathname)}
        >
          <button>close</button>
        </form>
      </dialog>
      <div
        className='border-2 rounded-md mb-2 text-left duration-200 hover:scale-110 hover:bg-base-200 cursor-pointer '
        onClick={() =>
          router.push(pathname + '?' + createQueryString('modal', id))
        }
      >
        <div className='flex items-center justify-between px-2 pt-2'>
          <h2 className='text-lg leading-6 font-medium text-gray-900'>
            {title}
          </h2>
        </div>
        <div className='mt-1 flex items-left flex-col justify-between px-2 pb-2'>
          {deadline && (
            <p className='text-xs font-medium text-gray-500'>
              Határidő: {deadline}
            </p>
          )}
          {assigned && (
            <p className='text-xs font-medium italic text-gray-500'>
              {assigned.displayName}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Todo;
