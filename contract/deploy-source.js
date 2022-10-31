import Arweave from 'arweave'
import fs from 'fs'

const src = fs.readFileSync('./dist/contract.js', 'utf-8')
const wallet = JSON.parse(fs.readFileSync('../mywallet.json', 'utf-8'))

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

async function main() {
  const tx = await arweave.createTransaction({ data: src })
  tx.addTag('Content-Type', 'application/javascript')
  tx.addTag('App-Name', 'SmartWeaveContractSource')
  tx.addTag('App-Version', '0.3.0')

  await arweave.transactions.sign(tx, wallet)
  console.log('source: ', tx.id)
  const result = await arweave.transactions.post(tx)
  console.log(result)
}

main()