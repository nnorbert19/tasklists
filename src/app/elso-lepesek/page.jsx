import Onboarding from '@/components/Onboarding';
import { auth } from 'firebase-admin';
import { cookies } from 'next/headers';

async function getUser() {
  const cookieStore = cookies();
  const session = cookieStore.get('session')?.value;
  const decodedClaims = await auth().verifySessionCookie(session, true);
  return decodedClaims;
}

async function Page() {
  const user = await getUser();

  return <Onboarding user={user} />;
}

export default Page;
