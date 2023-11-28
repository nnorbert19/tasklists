import Loading from '@/app/Loading';
import { useCtx } from '@/context/Context';
import { useState } from 'react';

const SearchComponent = (props) => {
  const { userData } = useCtx();
  const users = props?.filterFrom;

  const [filteredUsers, setFilteredUsers] = useState(props?.filterFrom);
  const [selectedUsers, setSelectedUsers] = useState(
    props?.selectedUser ? props?.selectedUser : []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  if (!users) return <Loading />;

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
    if (props?.onlyOne) {
      if (selectedUsers[0]?.email == userData?.email) {
        setSelectedUsers([]);
        props.setUsers([]);
      } else {
        setSelectedUsers([user]);
        props.setUsers(user);
      }
    } else {
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

      setSelectedUsers(updatedSelectedUsers);
      props.setUsers(updatedSelectedUsers);
    }
    setSearchTerm('');
    setShowPopup(false);
  };

  const filteredUsersToDisplay = filteredUsers?.filter(
    (filteredUser) => filteredUser.email !== userData?.email
  );

  return (
    <div className='w-full mb-4 '>
      <div className='relative'>
        <div>
          <label className='label block text-sm font-medium '>
            {props?.onlyOne
              ? 'Felhasználó hozzáadása'
              : 'Felhasználók hozzáadása'}
          </label>
          <input
            type='text'
            value={searchTerm}
            onChange={handleSearch}
            className={`input input-bordered input-primary mt-1 p-2 w-full border rounded`}
          />
        </div>
        {showPopup && (
          <div className='absolute top-full left-0 mt-2 p-2 bg-white border rounded shadow-lg  min-w-fit '>
            <ul className='space-y-2 max-h-28 overflow-x-auto'>
              {filteredUsersToDisplay.length == 0 && (
                <li>Nincs megjeleníthető felhasználó</li>
              )}
              {filteredUsersToDisplay?.map((user) => (
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
      <div className='mb-4'>
        <label className='label text-sm font-medium'>
          {props?.onlyOne
            ? 'Kiválasztott felhasználó:'
            : 'Kiválasztott felhasználók:'}
        </label>
        <ul className='max-h-24 min-h-6 border-primary p-1 overflow-y-auto overflow-hidden border rounded'>
          {selectedUsers?.map((user) => (
            <li key={user?.email} className='flex justify-between items-center'>
              <div className='flex flex-col'>
                <p className='text-sm font-semibold truncate max-w-[200px]'>
                  {user?.displayName}
                </p>
                <p className='text-xs text-gray-500 truncate max-w-[200px]'>
                  {user?.email}
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
