'use client';

import Avatar from './Avatar';
/*<Avatar styling={'w-16 h-16 mx-auto'} />*/

function Profile() {
  const userProfile = {
    name: 'John Doe',
    jobTitle: 'Web Developer',
    email: 'john.doe@example.com',
    followers: 500,
    following: 200,
    posts: 150,
    // Add more profile data as needed
  };
  return (
    <div className='bg-base-100 flex items-center justify-center '>
      <div className='bg-base-100 p-8 rounded-lg shadow-md space-y-4 max-w-md w-full'>
        <div className='md:flex gap-10 justify-between items-center transition-all duration-300 ease-in-out'>
          {/* Profile Information */}
          <div className='lg:w-1/2 text-center '>
            <Avatar styling={'w-16 h-16 mx-auto'} />
            <h1 className='text-2xl text-center font-bold mb-2'>
              {userProfile.name}
            </h1>
            <p className='text-center mb-2'>{userProfile.email}</p>

            <div className='flex justify-center space-x-4 '>
              <a
                href='#'
                className='btn btn-primary px-4 py-2 rounded-full transition duration-300'
              >
                Profil szerkesztése
              </a>
            </div>
          </div>

          {/* Statistics */}
          <div className='md:pt-1 md:w-1/2 pt-6 text-center '>
            <h2 className='text-lg font-semibold mb-2'>Statistics</h2>
            <p>Followers: {userProfile.followers}</p>
            <p>Following: {userProfile.following}</p>
            <p>Posts: {userProfile.posts}</p>
            {/* Add more statistics as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
