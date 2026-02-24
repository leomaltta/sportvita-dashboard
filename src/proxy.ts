import { withAuth, NextRequestWithAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { canAccessPath, getProfessorDefaultRedirect } from '@/lib/authz'

export default withAuth(
  function proxy(request: NextRequestWithAuth) {
    const { pathname } = request.nextUrl
    const token = request.nextauth.token
    const role = token?.role as string | undefined
    const sportRoute = token?.sportRoute as string | undefined

    if (role === 'admin' && pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.rewrite(new URL('/denied', request.url))
    }
    if (pathname.startsWith('/alertas') && role !== 'admin') {
      return NextResponse.rewrite(new URL('/denied', request.url))
    }

    if (role === 'prof' && sportRoute) {
      const redirectPath = getProfessorDefaultRedirect(pathname, sportRoute)
      if (redirectPath) {
        return NextResponse.redirect(new URL(redirectPath, request.url))
      }
    }

    if (!canAccessPath({ role, sportRoute, pathname })) {
      if (role === 'admin') {
        return NextResponse.next()
      }

      if (pathname === '/login') {
        return NextResponse.next()
      }

      return NextResponse.rewrite(new URL('/denied', request.url))
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
    '/alertas',
    '/alertas/:path*',
    '/professores',
    '/professores/:path*',
    '/estudantes',
    '/estudantes/:path*',
    '/admin/:path*',
  ],
}
