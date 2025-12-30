import { HeaderClient } from './Component.client'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function Header() {
  const payload = await getPayloadHMR({ config: configPromise })

  const headerData = await payload.findGlobal({
    slug: 'header',
    depth: 2,
  })

  return <HeaderClient data={headerData} />
}
