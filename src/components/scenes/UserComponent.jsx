import Avatar from '../user/Avatar';

function UserComponent({ user, withEmail }) {
  return (
    <div className='flex items-center space-x-2'>
      <div className='flex-shrink-0 w-8 h-8'>
        <Avatar photoUrl={user.photoUrl} />
      </div>
      <div className='flex-1 min-w-0'>
        <p
          className={`${
            withEmail
              ? 'text-sm font-medium text-gray-900 truncate dark:text-white'
              : 'text-xs font-medium italic text-gray-500'
          }`}
        >
          {user.displayName}
        </p>
        {withEmail && (
          <p className='text-xs text-gray-500 truncate dark:text-gray-400'>
            {user.email}
          </p>
        )}
      </div>
    </div>
  );
}

export default UserComponent;
