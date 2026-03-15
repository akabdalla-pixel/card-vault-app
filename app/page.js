import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'

export default async function Home() {
  const userId = await getUser()
  if (userId) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}

