import { withAuth, NextRequestWithAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function proxy(request: NextRequestWithAuth) {
    const { pathname } = request.nextUrl
    const token = request.nextauth.token

    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.rewrite(new URL('/denied', request.url))
    }
    const sportRoutes: Record<string, string[]> = {
      futsal: ['admin', 'proffut'],
      basquete: ['admin', 'profbas'],
      danca: ['admin', 'profdanca'],
      gr: ['admin', 'profgr'],
      handebol: ['admin', 'profhand'],
      judo: ['admin', 'profjudo'],
      karate: ['admin', 'profkarate'],
      natacao: ['admin', 'profnata'],
      voleibol: ['admin', 'profvolei'],
    }

    for (const [sport, allowedRoles] of Object.entries(sportRoutes)) {
      if (
        pathname.endsWith(`/${sport}`) &&
        !allowedRoles.includes(token?.role as string)
      ) {
        return NextResponse.rewrite(new URL('/denied', request.url))
      }
    }

    return NextResponse.next()
  },
  {

    callbacks: {
      authorized: ({ token }) => !!token,
    },
    secret: process.env.NEXTAUTH_SECRET,
  },
)
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/esportes/:path*',
    '/professores/:path*',
    '/estudantes/:path*',
    '/admin/:path*',
  ],
}