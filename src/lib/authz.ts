export interface RouteAccessInput {
  role?: string
  sportRoute?: string | null
  pathname: string
}

const PROTECTED_PROF_PATHS = ['/estudantes']

export function getProfessorDefaultRedirect(pathname: string, sportRoute: string) {
  if (pathname === '/' || pathname === '/dashboard') {
    return `/dashboard/${sportRoute}`
  }

  if (pathname === '/esportes') {
    return `/esportes/${sportRoute}`
  }

  return null
}

export function canAccessPath({ role, sportRoute, pathname }: RouteAccessInput): boolean {
  if (role === 'admin') {
    return true
  }

  if (role !== 'prof') {
    return false
  }

  if (!sportRoute) {
    return false
  }

  if (PROTECTED_PROF_PATHS.includes(pathname)) {
    return true
  }

  return pathname === `/dashboard/${sportRoute}` || pathname === `/esportes/${sportRoute}`
}
