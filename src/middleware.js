import { NextResponse } from 'next/server';

export async function middleware(request) {
  const session = request.cookies.get('session');

  if (!session) {
    return NextResponse.redirect(new URL('/bejelentkezes', request.url));
  }

  const responseAPI = await fetch(`${request.nextUrl.origin}/api/login`, {
    headers: {
      Cookie: `session=${session?.value}`,
    },
  });

  if (responseAPI.status !== 200) {
    return NextResponse.redirect(new URL('/bejelentkezes', request.url));
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
