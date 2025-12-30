import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type IsAdminOrAuthor = (args: AccessArgs<User>) => boolean

export const isAdminOrAuthor: IsAdminOrAuthor = ({ req: { user } }) => {
  if (!user) return false
  if (user.roles?.includes('admin')) return true
  if (user.roles?.includes('author')) return true
  return false
}
