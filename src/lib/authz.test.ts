import { canAccessPath, getProfessorDefaultRedirect } from './authz'

describe('authz', () => {
  it('allows admin access to any protected route', () => {
    expect(
      canAccessPath({
        role: 'admin',
        pathname: '/admin',
      }),
    ).toBe(true)
  })

  it('allows professor access only to own sport dashboard, own sport page and students list', () => {
    expect(
      canAccessPath({
        role: 'prof',
        sportRoute: 'basquete',
        pathname: '/dashboard/basquete',
      }),
    ).toBe(true)

    expect(
      canAccessPath({
        role: 'prof',
        sportRoute: 'basquete',
        pathname: '/esportes/basquete',
      }),
    ).toBe(true)

    expect(
      canAccessPath({
        role: 'prof',
        sportRoute: 'basquete',
        pathname: '/estudantes',
      }),
    ).toBe(true)

    expect(
      canAccessPath({
        role: 'prof',
        sportRoute: 'basquete',
        pathname: '/dashboard/futsal',
      }),
    ).toBe(false)

    expect(
      canAccessPath({
        role: 'prof',
        sportRoute: 'basquete',
        pathname: '/admin',
      }),
    ).toBe(false)
  })

  it('builds correct default redirects for professor', () => {
    expect(getProfessorDefaultRedirect('/', 'natacao')).toBe('/dashboard/natacao')
    expect(getProfessorDefaultRedirect('/dashboard', 'natacao')).toBe(
      '/dashboard/natacao',
    )
    expect(getProfessorDefaultRedirect('/esportes', 'natacao')).toBe(
      '/esportes/natacao',
    )
    expect(getProfessorDefaultRedirect('/estudantes', 'natacao')).toBe(null)
  })
})
