import { cn } from '@/lib/cn';
import Image from 'next/image';

function Avatar({ photoUrl, ...props }) {
  const url = photoUrl ? photoUrl : '/avatarPlaceholder.png';
  return (
    <div
      className={`${props?.styling} p-0 m-0 flex items-center justify-center`}
    >
      <Image
        alt='profile picture avatar'
        sizes='100%'
        quality={80}
        className={cn(
          'avatar w-full h-auto max-h-[400px] min-w-[32px] rounded-full aspect-square overflow-hidden border',
          props?.avatar
        )}
        src={url}
        width={0}
        height={0}
        {...props}
      />
    </div>
  );
}

export default Avatar;
