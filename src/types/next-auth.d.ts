import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
      sportRoute?: string | null
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    role: string
    sportRoute?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role?: string
    sportRoute?: string | null
  }
}
