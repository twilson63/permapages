import Arweave from 'arweave'
import { WarpNodeFactory } from 'warp-contracts'
import fs from 'fs'

const source = fs.readFileSync('./coin-contract.js', 'utf-8')
const wallet = JSON.parse(fs.readFileSync('../coinwallet.json', 'utf-8'))

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
    ticker: 'POAP-GAMECOIN',
    name: 'PoAP Game Coin',
    title: 'PoAP Game Rewards Coin',
    owner: addr,
    balances: {
      [addr]: 1_000_000_000_000
    },
    createdAt: Date.now()
  })
}, true)

console.log(result)