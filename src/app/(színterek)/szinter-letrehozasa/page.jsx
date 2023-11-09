import NewScene from '@/components/NewScene';
import { auth } from 'firebase-admin';
import { cookies } from 'next/headers';

async function getUser() {
  const cookieStore = cookies();
  const session = cookieStore.get('session')?.value;
  const decodedClaims = await auth().verifySessionCookie(session, true);
  return decodedClaims;
}

async function page() {
  const user = await getUser();

  return <NewScene user={user} />;
}

export default page;
