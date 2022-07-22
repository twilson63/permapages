import Arweave from 'arweave'
import { WarpNodeFactory } from 'warp-contracts'
import fs from 'fs'

const source = fs.readFileSync('./coin-contract.js', 'utf-8')
const wallet = JSON.parse(fs.readFileSync('../mywallet.json', 'utf-8'))

const arweave = Arweave.init({
  host: 'arweave.net', 
  port: 443,
  protocol: 'https'
})

// const arweave = Arweave.init({
//   host: 'localhost',
//   port: 1984,
//   protocol: 'http'
// })

const addr = await arweave.wallets.jwkToAddress(wallet)
const warp = WarpNodeFactory.memCached(arweave)

const result = await warp.createContract.deploy({
  wallet,
  src: source,
  initState: JSON.stringify({
    ticker: 'PASSPORT-POINT',
    name: 'Passport Rewards Point System Token',
    owner: addr,
    balances: {},
    registry: {},
    rewards: {},
    createdAt: Date.now()
  }
  , true
)
})

console.log(result)