function RightSideBar({ children }) {
  return (
    <div className='drawer drawer-end lg:drawer-open'>
      <input id='right-sidebar' type='checkbox' className='drawer-toggle' />
      <div className='h-full drawer-content'>
        {/* Page content here */}
        {children}
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
        <ul className='menu p-4 w-48 min-h-full bg-primary text-base-content'>
          {/* Sidebar content here */}
          <li>
            <a>Sidebar Item 1</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default RightSideBar;
