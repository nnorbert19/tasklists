import NewScene from '@/components/NewScene';
import { auth } from 'firebase-admin';
import { cookies } from 'next/headers';

async function page() {
  return <NewScene />;
}

export default page;
