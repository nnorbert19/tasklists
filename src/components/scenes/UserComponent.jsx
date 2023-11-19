import Avatar from '../user/Avatar';

function UserComponent({ user, withEmail }) {
  return (
    <li className='py-1 sm:py-2'>
      <div className='flex items-center space-x-2'>
        <div className='flex-shrink-0 w-8 h-8'>
          <Avatar photoUrl={user.photoUrl} />
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-medium text-gray-900 truncate dark:text-white'>
            {user.displayName}
          </p>
          {withEmail && (
            <p className='text-xs text-gray-500 truncate dark:text-gray-400'>
              {user.email}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

export default UserComponent;
