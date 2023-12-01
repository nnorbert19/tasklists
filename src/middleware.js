'use server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request, response) {
  const session = request.cookies.get('session');

  if (!session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const responseAPI = await fetch(`${request.nextUrl.origin}/api/login`, {
    headers: {
      Cookie: `session=${session?.value}`,
    },
  }).catch((error) => {
    console.error(error);
    return NextResponse.redirect(new URL('/', request.url));
  });

  if (responseAPI.status !== 200) {
    const response = NextResponse.next();

    const options = {
      name: 'session',
      value: '',
      maxAge: -1,
    };
    //request.cookies.delete('session')
    response.cookies.set(options);

    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

//Add your protected routes
export const config = {
  matcher: [
    '/kezdolap',
    '/elso-lepesek',
    '/admin',
    '/profil',
    '/szinter-letrehozasa',
    '/szinterek/:path*',
  ],
};
