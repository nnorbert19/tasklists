import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function getUser() {
  const cookieStore = cookies();
  const session = cookieStore?.get('session')?.value;
  if (session) {
    redirect('/kezdolap');
  }
}

async function page() {
  await getUser();
  return <div>loggedout</div>;
}

export default page;
