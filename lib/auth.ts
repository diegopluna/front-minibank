import { authClient } from './auth-client'

export const useSession = authClient.useSession

export function isManager(user: { role?: string | null }) {
  return user.role === 'admin'
}
