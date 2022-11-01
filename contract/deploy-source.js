import { WarpFactory } from 'warp-contracts/mjs'
import fs from 'fs'

const warp = WarpFactory.forMainnet()

const walletFile = process.argv.slice(2)[0]
const wallet = JSON.parse(fs.readFileSync(walletFile, 'utf-8'))
const src = fs.readFileSync('./dist/contract.js', 'utf-8')
//const creator = '4ALXfd76F129U8OCv0YUzTSuBTivUeqAVqnLD-sUk4c'
//const CONTRACT = 'FMRHYgSijiUNBrFy-XqyNNXenHsCV0ThR4lGAPO4chA' // STAMPCOIN-TEST-v12
const CONTRACT = 'q9zJ9cQZg5VuNKUdyWBt0C-C66KxArXHCvKqBt_3vdo' // ATOMIC-ASSET
const contract = warp.contract(CONTRACT).connect(wallet)

const srcTxId = await contract.save({ src, useBundler: true })
console.log('new Source', srcTxId)


/*
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
*/