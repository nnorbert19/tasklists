import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';

const SearchComponent = () => {
  const emailRef = useRef();
  const dropdownRef = useRef();
  const peopleData = [
    { id: 1, name: 'John Smith' },
    { id: 2, name: 'Jane Doe' },
    { id: 3, name: 'Alice Johnson' },
    // Add more people data as needed
  ];
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [email, setEmail] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState();
  const [selectedPeople, setSelectedPeople] = useState([]);

  useEffect(() => {
    getUsers();
  }, [db]);

  async function getUsers() {
    const querySnapshot = await getDocs(collection(db, 'users'));
    let userData = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, ' => ', doc.data());
      userData.push(doc.data());
    });
    querySnapshot.forEach((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(userData);
    setUsers(userData);
  }

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
  };

  return (
    <div className='form-control  w-full p-4'>
      <div className='flex flex-row'>
        <input
          type='text'
          //placeholder='Search people...'
          ref={emailRef}
          onChange={(e) => setEmail(e.target.value)}
          //onChange={handleSearch}
          className={`input input-bordered input-primary w-50 max-w-xs`}
        />
        <label className='label'>
          <span className='label-text'>Felhasználók hozzáadása</span>
        </label>
      </div>
      <div
        ref={dropdownRef}
        className='w-fit max-h-60 inset-y-0.5 border border-gray-300 rounded-md bg-white absolute overflow-y-auto'
      >
        {users
          ?.filter((user) =>
            user?.email?.toLowerCase()?.includes(searchTerm.toLowerCase())
          )
          ?.map((user) => (
            <li key={user.id}>
              {user?.displayName}{' '}
              <button
                onClick={() => handleSelectUser(user)}
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
              >
                Select
              </button>
            </li>
          ))}
      </div>

      <ul className='space-y-2'></ul>

      <h3 className='text-lg font-bold mt-8 mb-2'>Selected Users:</h3>
      <ul className='space-y-2'>
        {selectedUsers.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchComponent;
