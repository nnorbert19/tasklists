import { auth } from 'firebase-admin';
import { customInitApp } from '@/lib/firebase-admin';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';

customInitApp();

export async function POST() {
  const authorization = headers().get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    const decodedToken = await auth()
      .verifyIdToken(idToken)
      .catch(() => {
        const options = {
          name: 'session',
          value: '',
          maxAge: -1,
        };

        cookies().set(options);
      });

    if (decodedToken) {
      //session cookie
      const expiresIn = 60 * 60 * 24 * 5 * 1000;
      const sessionCookie = await auth().createSessionCookie(idToken, {
        expiresIn,
      });
      const options = {
        name: 'session',
        value: sessionCookie,
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
      };

      cookies().set(options);
    }
  }

  return NextResponse.json({}, { status: 200 });
}

export async function GET() {
  const session = cookies().get('session')?.value || '';

  if (!session) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  const decodedClaims = await auth()
    .verifySessionCookie(session, true)
    .catch(() => {
      const options = {
        name: 'session',
        value: '',
        maxAge: -1,
      };

      cookies().set(options);
    });

  if (!decodedClaims) {
    const options = {
      name: 'session',
      value: '',
      maxAge: -1,
    };

    cookies().set(options);
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  return NextResponse.json({ isLogged: true }, { status: 200 });
}
