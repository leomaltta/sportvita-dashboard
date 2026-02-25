const mockGetServerSession = jest.fn()
const mockRedirect = jest.fn()

jest.mock('next-auth', () => ({
  getServerSession: (...args: unknown[]) => mockGetServerSession(...args),
}))

jest.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}))

jest.mock('@/app/api/auth/[...nextauth]/options', () => ({
  authOptions: {},
}))

describe('Home auth behavior', () => {
  let Home: any

  beforeAll(() => {
    Home = require('./page').default
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('redirects authenticated users to /dashboard', async () => {
    mockGetServerSession.mockResolvedValueOnce({ user: { email: 'a@b.com' } })

    await Home()

    expect(mockRedirect).toHaveBeenCalledWith('/dashboard')
  })

  it('renders landing for unauthenticated users without redirect', async () => {
    mockGetServerSession.mockResolvedValueOnce(null)

    await Home()

    expect(mockRedirect).not.toHaveBeenCalled()
  })
})
