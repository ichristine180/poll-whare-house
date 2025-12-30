import { FooterClient } from './Component.client'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function Footer() {
  const payload = await getPayloadHMR({ config: configPromise })

  const footerData = await payload.findGlobal({
    slug: 'footer',
    depth: 2,
  })

  return <FooterClient data={footerData} />
}
