import Arweave from 'arweave'
import { WarpNodeFactory } from 'warp-contracts'
import fs from 'fs'

const source = fs.readFileSync('./poap-contract.js', 'utf-8')
const wallet = JSON.parse(fs.readFileSync('../mywallet.json', 'utf-8'))

const arweave = Arweave.init({
  host: 'arweave.net', 
  port: 443,
  protocol: 'https'
})

const addr = await arweave.wallets.jwkToAddress(wallet)
const warp = WarpNodeFactory.memCached(arweave)

const result = await warp.createContract.deploy({
  wallet,
  src: source,
  initState: JSON.stringify({
    ticker: 'POAP-TARGET',
    name: 'POAP NFT Attention Contract',
    title: 'PoAP Attention Contract Example',
    owner: addr,
    locked: false,
    balances: {},
    stakes: {},
    createdAt: Date.now(),
    contentType: 'text/html'
  }),
  data: {'Content-Type': 'text/html', body: '<h1>Test</h1>'}
}, true)

console.log(result)