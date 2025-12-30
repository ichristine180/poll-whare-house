import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'

import { Poll } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Poll> = ({ doc }) => {
  return doc?.question ? `${doc.question} | PollWarehouse` : 'PollWarehouse'
}

const generateURL: GenerateURL<Poll> = ({ doc }) => {
  const url = getServerSideURL()
  return doc?.slug ? `${url}/poll/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  payloadCloudPlugin(),
]
