import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

const prismaBase = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaBase

const CONNECTION_ERRORS = [
  'Server has closed the connection',
  'Connection refused',
  'Connection reset',
  'ECONNRESET',
  'ECONNREFUSED',
  'socket hang up',
]
const CONNECTION_CODES = ['P1001', 'P1002', 'P2024']

function isConnectionError(error) {
  if (!error) return false
  if (CONNECTION_CODES.includes(error?.code)) return true
  return CONNECTION_ERRORS.some(msg => error?.message?.includes(msg))
}

async function runWithReconnect(fn) {
  try {
    return await fn()
  } catch (error) {
    if (isConnectionError(error)) {
      try {
        await prismaBase.$disconnect()
        await prismaBase.$connect()
        return await fn()
      } catch (retryError) {
        throw retryError
      }
    }
    throw error
  }
}

function proxyModel(model) {
  return new Proxy(model, {
    get(target, prop) {
      const value = target[prop]
      if (typeof value === 'function') {
        return (...args) => runWithReconnect(() => value.apply(target, args))
      }
      return value
    },
  })
}

const prisma = new Proxy(prismaBase, {
  get(target, prop) {
    const value = target[prop]
    if (
      typeof prop === 'string' &&
      !prop.startsWith('$') &&
      !prop.startsWith('_') &&
      value &&
      typeof value === 'object'
    ) {
      return proxyModel(value)
    }
    return typeof value === 'function' ? value.bind(target) : value
  },
})

export default prisma
