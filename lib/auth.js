import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const SECRET = process.env.JWT_SECRET || 'card-vault-secret-change-me'

export function signToken(userId) {
  return jwt.sign({ userId }, SECRET, { expiresIn: '30d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

export async function getUser(req) {
  // 1. Try Bearer token from Authorization header (mobile app)
  if (req) {
    const authHeader = req.headers?.get?.('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const decoded = verifyToken(token)
      if (decoded) return decoded.userId
    }
  }
  // 2. Fall back to cookie (web app)
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return null
    const decoded = verifyToken(token)
    if (!decoded) return null
    return decoded.userId
  } catch {
    return null
  }
}
