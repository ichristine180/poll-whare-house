import { CreatePollForm } from '@/components/CreatePoll'
import { SubscribeBox } from '@/components/SubscribeBox'
import type { Metadata } from 'next'
import { getServerSideURL } from '@/utilities/getURL'

const siteUrl = getServerSideURL()

export const metadata: Metadata = {
  title: 'Create a Poll - PollWarehouse',
  description: 'Create simple, real-time polls anyone can answer - no accounts, no friction.',
  alternates: {
    canonical: `${siteUrl}/create`,
  },
}

export default function CreatePage() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create a Poll</h1>
        <p className="text-gray-600">
          Create simple, real-time polls anyone can answer — no accounts, no friction.
        </p>
      </div>
      <CreatePollForm />
      <SubscribeBox />
    </div>
  )
}
