function HistoryLister({ history }) {
  function toggleModal() {
    document.getElementById('historyModal').showModal();
  }

  return (
    <>
      <dialog id='historyModal' className='modal'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>Hello!</h3>
          <p className='py-4'>Press ESC key or click outside to close</p>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
      <div className='bg-base-200 max-h-56 p-1 pb-2 mt-2 border-base-100 rounded-lg text-center'>
        <p className='font-medium'>Módosítások:</p>
        <ul
          role='list'
          className='divide-y divide-gray-200 dark:divide-gray-700 text-left overflow-hidden'
        >
          {/*users.map((user) => (
    ))*/}
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

export default HistoryLister;
