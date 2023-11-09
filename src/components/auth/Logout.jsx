'use client';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

function Logout() {
  const router = useRouter();

  async function logout() {
    await signOut(auth);
    const response = await fetch('/api/signout', {
      method: 'POST',
    });
    if (response.status === 200) {
      router.push('/bejelentkezes');
    }
  }

  return (
    <button className='btn btn-secondary' onClick={() => logout()}>
      logout
    </button>
  );
}

export default Logout;