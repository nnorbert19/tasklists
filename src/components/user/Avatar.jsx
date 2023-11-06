import Image from 'next/image';

function Avatar({ photoUrl }) {
  const url = photoUrl ? photoUrl : '/avatarPlaceholder.png';
  return (
    <div className='h-full w-full p-0 m-0 flex items-center justify-center'>
      <Image
        alt='profile picture avatar'
        sizes='100%'
        quality={80}
        style={{ width: 'auto', height: 'auto', maxHeight: '400px' }}
        className=' avatar rounded-full aspect-square overflow-hidden'
        src={url}
        width={0}
        height={0}
      />
    </div>
  );
}

export default Avatar;
