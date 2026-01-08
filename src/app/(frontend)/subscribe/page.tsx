import { Metadata } from 'next'
import { Subscribe } from '@/components/Subscribe'

export const metadata: Metadata = {
  title: 'Subscribe | PollWarehouse',
  description: 'Subscribe to get the latest polls and trending topics delivered to your inbox.',
}

export default function SubscribePage() {
  return <Subscribe />
}
