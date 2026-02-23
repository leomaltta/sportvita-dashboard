import { withAuth, NextRequestWithAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

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

    if (role === 'admin') {
      return NextResponse.next()
    }

    if (role === 'prof') {
      if (!sportRoute) {
        return NextResponse.rewrite(new URL('/denied', request.url))
      }

      if (pathname === '/' || pathname === '/dashboard') {
        return NextResponse.redirect(
          new URL(`/dashboard/${sportRoute}`, request.url),
        )
      }

      if (pathname === '/esportes') {
        return NextResponse.redirect(new URL(`/esportes/${sportRoute}`, request.url))
      }

      const allowedPaths = new Set([
        '/estudantes',
        `/dashboard/${sportRoute}`,
        `/esportes/${sportRoute}`,
      ])

      if (!allowedPaths.has(pathname)) {
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
    '/professores',
    '/professores/:path*',
    '/estudantes',
    '/estudantes/:path*',
    '/admin/:path*',
  ],
}
