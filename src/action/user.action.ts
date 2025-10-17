'use server'

import { getPayloadClient } from '@/payloadClient'
import { User } from '@/payload-types'
import { headers as getHeaders } from 'next/headers'

export async function getCurrentUser(): Promise<User | null> {
  try {
    const headers = await getHeaders()
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers })
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function isUserAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.isAdmin === true
}
