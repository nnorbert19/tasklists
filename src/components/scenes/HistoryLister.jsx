import Loading from '@/app/Loading';
import { format, fromUnixTime } from 'date-fns';
import { useEffect, useState } from 'react';

function HistoryLister({ history }) {
  const [historyArray, setHistoryArray] = useState();

  function makeArray() {
    let array = [];
    history.map((event) => {
      let text;
      switch (event.type) {
        case 'created':
          text = `${event.user} létrehozta a színteret.`;
          break;
        case 'usersAdded':
          text = `${
            event.user
          } hozzáadta a színtérhez az alábbi felhasználó(felhasználókat): ${event.addedUsers.map(
            (user) => user.displayName
          )}.`;
          break;
        case 'todoCreate':
          text = `${event.user} létrehozta a(z) ${event.title} nevű feladatot.`;
          break;

        case 'todoUpdated':
          text = `${event.user} modosította a(z) ${event.title} nevű feladatot.`;
          break;
        case 'todoRemoved':
          text = `${event.user} törölte a(z) ${event.title} nevű feladatot.`;
          break;
        case 'todoMoved':
          text = `${event.user} áthelyezte a(z) ${event.title} nevű feladatot a(z) ${event.to} állapotba.`;
          break;
        default:
          break;
      }
      array.push({ text: text, date: event.date });
    });
    array.reverse();

    setHistoryArray(array);
  }

  useEffect(() => {
    makeArray();
  }, [history]);

  function toggleModal() {
    document.getElementById('historyModal').showModal();
  }

  return (
    <>
      <dialog id='historyModal' className='modal'>
        <div className='modal-box'>
          <ul
            role='list'
            className='divide-y divide-base-300 dark:divide-gray-700 text-left'
          >
            {historyArray &&
              historyArray.map((event) => (
                <li key={event.date} className='py-1 sm:py-2'>
                  <div className='text-s font-medium'>{event.text}</div>
                  <p className='text-xs font-medium italic text-gray-500'>
                    {/*format(
                      fromUnixTime(event.date.nanoseconds / 1000),
                      'yyyy/MM/dd HH:MM'
                    )*/}
                    {format(fromUnixTime(event.date), 'yyyy/MM/dd HH:mm')}
                  </p>
                </li>
              ))}
          </ul>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>Bezárás</button>
        </form>
      </dialog>
      <div className='bg-base-200 h-56 max-w-40 p-1 pb-2 m-2 border-base-100 rounded-lg text-center'>
        {historyArray ? (
          <>
            <p className='font-medium'>Módosítások:</p>
            <ul
              role='list'
              className='divide-y divide-base-300 h-40 dark:divide-gray-700 text-left overflow-hidden'
            >
              {historyArray.map((event) => (
                <li key={event.date} className='py-1 sm:py-2'>
                  <div className='truncate max-w-[170px]'>{event.text}</div>
                  <p className='text-xs font-medium italic text-gray-500'>
                    {format(fromUnixTime(event.date), 'yyyy/MM/dd HH:mm')}
                  </p>
                </li>
              ))}
            </ul>
            <button
              className='btn btn-secondary btn-xs m-auto'
              onClick={() => toggleModal()}
            >
              Módosítások listázása
            </button>
          </>
        ) : (
          <Loading />
        )}
      </div>
    </>
  );
}

export default HistoryLister;
