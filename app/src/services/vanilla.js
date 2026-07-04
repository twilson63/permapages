import Arweave from 'arweave'
import { htmlify } from './atomic'
import getHost from './get-host'

let options = {}

options = { host: getHost(), port: 443, protocol: 'https' }
const arweave = Arweave.init(options)
// deploy permapage as a directly-signed transaction (no bundler)
export default async function (page) {
  const topics = page.topics.map(t => ({
    name: `topic:${t}`,
    value: t
  }))
  const tags = [
    { name: 'Content-Type', value: 'text/html' },
    { name: 'Title', value: page.title },
    { name: 'Description', value: page.description },
    { name: 'Type', value: 'page' },
    { name: 'Protocol', value: page.protocol },
    { name: 'Timestamp', value: new Date().toISOString() }
  ].concat(topics)
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
