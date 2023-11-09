import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';

const SearchComponent = (props) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    getUsers();
  }, [db]);

  async function getUsers() {
    const querySnapshot = await getDocs(collection(db, 'users'));
    let userData = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      userData.push(doc.data());
    });
    querySnapshot.forEach((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setFilteredUsers(userData);
    setUsers(userData);
  }

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    if (searchTerm.length >= 2) {
      const filteredUsers = users.filter((user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filteredUsers);
      setShowPopup(true);
    } else {
      setFilteredUsers([]);
      setShowPopup(false);
    }
  };

  const handleToggleUser = (user) => {
    const updatedSelectedUsers = [...selectedUsers];
    const isUserSelected = updatedSelectedUsers.some(
      (selectedUser) => selectedUser.email === user.email
    );

    if (isUserSelected) {
      const index = updatedSelectedUsers.findIndex(
        (selectedUser) => selectedUser.email === user.email
      );
      updatedSelectedUsers.splice(index, 1);
    } else {
      updatedSelectedUsers.push(user);
    }
    setSearchTerm('');
    setShowPopup(false);
    setSelectedUsers(updatedSelectedUsers);
    props.setUsers(updatedSelectedUsers);
  };

  const filteredUsersToDisplay = filteredUsers.filter(
    (user) => user.email !== props.userEmail
  );

  return (
    <div className='form-control w-full px-4 flex flex-row justify-between items-center'>
      <div className='relative'>
        <div className=''>
          <label className='label'>
            <span className='label-text'>Felhasználók hozzáadása</span>
          </label>
          <input
            type='text'
            value={searchTerm}
            onChange={handleSearch}
            className={`input input-bordered input-primary w-50 max-w-xs`}
          />
        </div>
        {showPopup && (
          <div className='absolute top-full left-0 mt-2 p-2 bg-white border rounded shadow-lg z-20 min-w-fit max-w-sm'>
            <ul className='space-y-2 max-h-28 overflow-x-auto'>
              {filteredUsersToDisplay.map((user) => (
                <li key={user.email} className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={selectedUsers.some(
                      (selectedUser) => selectedUser.email === user.email
                    )}
                    onChange={() => handleToggleUser(user)}
                    className='mr-2 checkbox checkbox-primary'
                  />
                  <div className='flex flex-col'>
                    <p className='text-sm font-semibold truncate max-w-[200px]'>
                      {user.displayName}
                    </p>
                    <p className='text-xs text-gray-500 truncate max-w-[200px]'>
                      {user.email}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div>
        <label className='label'>
          <span className='label-text'>Kiválasztott felhasználók:</span>
        </label>
        <ul className='space-y-2 max-h-24 overflow-y-auto overflow-hidden'>
          {selectedUsers.map((user) => (
            <li key={user.email} className='flex justify-between items-center'>
              <div className='flex flex-col'>
                <p className='text-sm font-semibold truncate max-w-[200px]'>
                  {user.displayName}
                </p>
                <p className='text-xs text-gray-500 truncate max-w-[200px]'>
                  {user.email}
                </p>
              </div>
              <input
                type='checkbox'
                checked
                onChange={() => handleToggleUser(user)}
                className='mr-2 checkbox checkbox-primary'
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchComponent;
