'use client';

import Loading from '@/app/Loading';
import { useState } from 'react';
import UserLister from './UserLister';
import ScenesLister from './ScenesLister';

function AdminDashboard() {
  const [activeComponent, setActiveComponent] = useState('users');
  return (
    <div className='max-w-3xl w-full max-h-[80vh] overflow-auto bg-base-100 p-2 rounded-lg shadow-xl flex flex-col items-center'>
      <h3 className='text-xl font-medium pb-4'>Admin felület</h3>
      <ul className='menu menu-horizontal gap-1 bg-base-200 rounded-box'>
        <li>
          <a
            className={`${activeComponent == 'users' && 'active'}`}
            onClick={() => setActiveComponent('users')}
          >
            Felhasználók
          </a>
        </li>
        <li>
          <a
            className={`${activeComponent == 'scenes' && 'active'}`}
            onClick={() => setActiveComponent('scenes')}
          >
            Színterek
          </a>
        </li>
      </ul>
      {activeComponent == 'users' ? <UserLister /> : <ScenesLister />}
    </div>
  );
}

export default AdminDashboard;
