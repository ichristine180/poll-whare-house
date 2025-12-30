import type { FieldAccess } from 'payload'

import type { User } from '@/payload-types'

export const isAdminFieldLevel: FieldAccess<User> = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes('admin'))
}
