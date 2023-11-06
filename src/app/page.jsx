import Logout from '@/components/auth/Logout';
import Profile from '@/components/user/Profile';
import { auth } from 'firebase-admin';
import { cookies } from 'next/headers';

async function getUser() {
  const cookieStore = cookies();
  const session = cookieStore.get('session')?.value;
  const decodedClaims = await auth().verifySessionCookie(session, true);
  return decodedClaims;
}

export default async function page() {
  const user = await getUser();
  return (
    <div>
      <Profile />
      <Logout />
    </div>
  );
}
