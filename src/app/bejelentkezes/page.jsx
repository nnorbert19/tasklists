import Login from '@/components/auth/Login';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function getUser() {
  const cookieStore = cookies();
  const session = cookieStore?.get('session')?.value;
  if (session) {
    redirect('/kezdolap');
  }
}

async function Page() {
  await getUser();
  return <Login />;
}

export default Page;
