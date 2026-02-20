

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcrypt'
import prisma from '../../../../../prisma/client'


const nextAuthAdapter = (() => {
  try {
    return PrismaAdapter(prisma)
  } catch {
    console.warn(
      'NextAuth is running without Prisma adapter because Prisma client is not configured for Prisma 7 client engine.',
    )

    return undefined
  }
})()


export const authOptions: NextAuthOptions = {
  ...(nextAuthAdapter ? { adapter: nextAuthAdapter } : {}),
  pages: {
    signIn: '/login',
    error: '/login',
  },

  providers: [

    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'nome@exemplo.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },


      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

                try {
                  
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          })


          if (!user) {
            return null
          }


          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password,
          )


          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          }
        } catch {
          return null
        }
      },
    }),
  ],


  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session) {
        return { ...token, ...session.user }
      }

      if (user) {
        token.role = user.role
      }

      return token
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string
      }

      return session
    },
  },


  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, 
  },


  secret: process.env.NEXTAUTH_SECRET,


  debug: process.env.NODE_ENV === 'development',
}