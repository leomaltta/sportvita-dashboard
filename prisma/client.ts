import { PrismaClient } from '@prisma/client'
import type { SqlDriverAdapterFactory } from '@prisma/client/runtime/client'


type PrismaClientOptions = ConstructorParameters<typeof PrismaClient>[0]
type OptionalPgAdapterModule = {
  PrismaPg?: new (pool: unknown) => SqlDriverAdapterFactory
}

type OptionalPgModule = {
  Pool?: new (config: { connectionString?: string }) => unknown
}

const prismaClientSingleton = () => {
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
    const adapterPackageName = '@prisma/adapter-' + 'pg'
    const pgPackageName = 'p' + 'g'

    const pgAdapterModule = runtimeRequire(
      adapterPackageName,
    ) as OptionalPgAdapterModule
    const pgModule = runtimeRequire(pgPackageName) as OptionalPgModule

    if (pgAdapterModule.PrismaPg && pgModule.Pool) {
      const pool = new pgModule.Pool({
        connectionString: process.env.DATABASE_URL,
      })

      options.adapter = new pgAdapterModule.PrismaPg(pool)
      return new PrismaClient(options)
    } 
  } catch {
  }

  const errorMessage =
    'Prisma Client is running with the Prisma 7 "client" engine. Configure PRISMA_ACCELERATE_URL or install @prisma/adapter-pg and pg to create PrismaClient.'

  console.warn(errorMessage)

  return new Proxy({} as PrismaClient, {
    get() {
      throw new Error(errorMessage)
    },
})
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}


const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma


if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}


if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}