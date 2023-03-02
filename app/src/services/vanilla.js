import Arweave from 'arweave'

const arweave = Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' })
// deploy permapage old school
export default async function (html, htmlTags, src, srcTags) {
  // publish web page
  const webpageTx = await arweave.createTransaction({ data: html })
  htmlTags.map(t => webpageTx.addTag(t.name, t.value))
  await arweave.transactions.sign(webpageTx)
  const result1 = await arweave.transactions.post(webpageTx)
  // publish source
  const srcTx = await arweave.createTransaction({ data: src })
  srcTags.map(t => srcTx.addTag(t.name, t.value))
  srcTx.addTag('Webpage', webpageTx.id)
  await arweave.transactions.sign(srcTx)
  const result2 = await arweave.transactions.post(srcTx)
  //return { result1, result2 }
  return {
    id: srcTx.id,
    webpage: webpageTx.id
  }
}
