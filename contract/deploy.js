import Arweave from 'arweave'
import fs from 'fs'

const source = fs.readFileSync('./page-contract.js', 'utf-8')
const wallet = JSON.parse(fs.readFileSync('../mywallet.json', 'utf-8'))

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

const tx = await arweave.createTransaction({
  data: source
})

tx.addTag('App-Name', 'SmartWeaveContractSource')
tx.addTag('App-Version', '0.3.0')
tx.addTag('Content-Type', 'application/javascript')

await arweave.transactions.sign(tx, wallet)
await arweave.transactions.post(tx)

console.log(tx.id)