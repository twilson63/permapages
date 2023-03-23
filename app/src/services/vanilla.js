import Arweave from 'arweave'
import { htmlify } from './atomic'

const DATAFI_PAGE_SRC = __ATOMIC_ASSET_SRC__

const [APP_NAME, APP_VERSION, CONTRACT_SRC, INIT_STATE] =
  ['App-Name', 'App-Version', 'Contract-Src', 'Init-State']


const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' })
// deploy permapage old school
export default async function (page) {
  const topics = page.topics.map(t => ({
    name: `topic:${t}`,
    value: t
  }))
  let tags = [
    { name: 'Content-Type', value: 'text/html' },
    { name: 'Title', value: page.title },
    { name: 'Description', value: page.description },
    { name: 'Type', value: 'page' },
    { name: 'Protocol', value: page.protocol },
    { name: 'Timestamp', value: new Date().toISOString() }
  ].concat(topics)
  if (!page.noContract) {
    tags = tags.concat([
      { name: APP_NAME, value: 'SmartWeaveContract' },
      { name: APP_VERSION, value: '0.3.0' },
      { name: CONTRACT_SRC, value: DATAFI_PAGE_SRC },
      { name: INIT_STATE, value: JSON.stringify(page.state) }
    ])
  }
  // publish web page
  const webpageTx = await arweave.createTransaction({ data: htmlify(page) })

  tags.map(t => webpageTx.addTag(t.name, t.value))
  await arweave.transactions.sign(webpageTx)
  await arweave.transactions.post(webpageTx)

  //return { result1, result2 }
  return {
    id: webpageTx.id
  }
}
