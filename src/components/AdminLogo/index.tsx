'use client'

import React, { useEffect, useState } from 'react'

const AdminLogo: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoText, setLogoText] = useState<string>('PollWarehouse')

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch('/api/globals/header?depth=1')
        const data = await response.json()
        if (data?.logo?.image?.url) {
          setLogoUrl(data.logo.image.url)
        }
        if (data?.logo?.text) {
          setLogoText(data.logo.text)
        }
      } catch (error) {
        console.error('Failed to fetch logo:', error)
      }
    }
    fetchLogo()
  }, [])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {logoUrl && (
        <img
          src={logoUrl}
          alt={logoText}
          style={{ height: '32px', width: 'auto', borderRadius: '50%' }}
        />
      )}
      <span style={{ fontSize: '18px', fontWeight: 600, color: '#6D4AF9' }}>
        {logoText}
      </span>
    </div>
  )
}

export default AdminLogo
