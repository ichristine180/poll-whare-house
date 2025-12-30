'use client'

import { PayloadAdminBar } from '@payloadcms/admin-bar'
import { useRouter } from 'next/navigation'
import React from 'react'

import { getClientSideURL } from '@/utilities/getURL'

const baseClass = 'admin-bar'

export const AdminBar: React.FC<{
  adminBarProps?: {
    preview?: boolean
  }
}> = (props) => {
  const { adminBarProps } = props || {}
  const router = useRouter()

  const onAuthChange = React.useCallback((user: any) => {
    router.refresh()
  }, [router])

  return (
    <div className={baseClass}>
      <PayloadAdminBar
        {...adminBarProps}
        cmsURL={getClientSideURL()}
        onAuthChange={onAuthChange}
      />
    </div>
  )
}
