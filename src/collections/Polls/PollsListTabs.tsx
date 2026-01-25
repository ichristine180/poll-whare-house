'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'

const PollsListTabs = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Get current source filter from URL
  const currentSource = searchParams.get('where[source][equals]') || 'all'

  const handleTabChange = (source: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (source === 'all') {
      params.delete('where[source][equals]')
    } else {
      params.set('where[source][equals]', source)
    }

    // Reset to page 1 when changing tabs
    params.delete('page')

    router.push(`${pathname}?${params.toString()}`)
  }

  const tabs = [
    { id: 'all', label: 'All Polls' },
    { id: 'admin', label: 'Admin Polls' },
    { id: 'guest', label: 'Guest Polls' },
  ]

  return (
    <div style={{
      display: 'flex',
      gap: '0',
      marginBottom: '1.5rem',
      borderBottom: '1px solid var(--theme-elevation-150)'
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: currentSource === tab.id ? '600' : '400',
            color: currentSource === tab.id ? 'var(--theme-elevation-1000)' : 'var(--theme-elevation-500)',
            borderBottom: currentSource === tab.id ? '2px solid var(--theme-elevation-1000)' : '2px solid transparent',
            marginBottom: '-1px',
            transition: 'all 0.15s ease',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default PollsListTabs
