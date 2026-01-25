'use client'

import { useRowLabel } from '@payloadcms/ui'

const OptionRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ text?: string }>()

  const label = data?.text || `Option ${(rowNumber ?? 0) + 1}`

  return <span>{label}</span>
}

export default OptionRowLabel
