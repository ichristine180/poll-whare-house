'use client'

import React, { useEffect, useState } from 'react'

const AdminIcon: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch('/api/globals/header?depth=1')
        const data = await response.json()
        if (data?.logo?.image?.url) {
          setLogoUrl(data.logo.image.url)
        }
      } catch (error) {
        console.error('Failed to fetch logo:', error)
      }
    }
    fetchLogo()
  }, [])

  if (!logoUrl) {
    return (
      <div style={{
        width: '24px',
        height: '24px',
        backgroundColor: '#6D4AF9',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        P
      </div>
    )
  }

  return (
    <img
      src={logoUrl}
      alt="PollWarehouse"
      style={{ height: '24px', width: 'auto', borderRadius: '50%' }}
    />
  )
}

export default AdminIcon
