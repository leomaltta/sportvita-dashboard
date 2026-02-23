import { PrismaClient } from '@prisma/client'
import type { SqlDriverAdapterFactory } from '@prisma/client/runtime/client'

type PrismaClientOptions = ConstructorParameters<typeof PrismaClient>[0]

type PgAdapterModule = {
  PrismaPg: new (pool: unknown) => SqlDriverAdapterFactory
}

type PgModule = {
  Pool: new (config: { connectionString?: string }) => unknown
}

type GlobalWithPrisma = typeof globalThis & {
  prismaGlobal?: PrismaClient
}

function createPrismaClient() {
  const options: PrismaClientOptions = {
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  }

  const accelerateUrl = process.env.PRISMA_ACCELERATE_URL
  if (accelerateUrl) {
    options.accelerateUrl = accelerateUrl
    return new PrismaClient(options)
  }

  try {
    const runtimeRequire: NodeJS.Require = require
    const { PrismaPg } = runtimeRequire('@prisma/adapter-pg') as PgAdapterModule
    const { Pool } = runtimeRequire('pg') as PgModule

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })

    options.adapter = new PrismaPg(pool)
    return new PrismaClient(options)
  } catch (error) {
    console.error('Failed to initialize Prisma pg adapter:', error)
    throw error
  }
}

const globalForPrisma = globalThis as GlobalWithPrisma
const prisma = globalForPrisma.prismaGlobal ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaGlobal = prisma
}

export default prisma
