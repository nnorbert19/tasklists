import { NextResponse } from 'next/server';

import { customInitApp } from '@/lib/firebase-admin';
import { auth } from 'firebase-admin';
customInitApp();

export async function POST(req) {
  const data = await req.json();

  auth()
    .deleteUser(data.uid)
    .catch((error) => {
      return NextResponse.json({ error: error }, { status: 200 });
    });
  return NextResponse.json({ error: null }, { status: 200 });
}
