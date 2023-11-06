import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const data = await req.json();

  const docRef = doc(db, 'users', data.email);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return NextResponse.json({ userHasData: true }, { status: 200 });
  } else {
    return NextResponse.json({ userHasData: false }, { status: 200 });
  }
}
