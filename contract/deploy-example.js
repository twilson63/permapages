import { WarpFactory } from 'warp-contracts/mjs'
import fs from 'fs'

const warp = WarpFactory.forMainnet()

const walletFile = process.argv.slice(2)[0]
const wallet = JSON.parse(fs.readFileSync(walletFile, 'utf-8'))
const src = fs.readFileSync('./dist/contract.js', 'utf-8')
const addr = 'vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI'
const r = await warp.createContract.deploy({
  src,
  wallet,
  initState: JSON.stringify({
    ticker: 'PAGE-EXAMPLE',
    name: 'PAGE Example Contract',
    title: 'Contract Example',
    creator: addr,
    balances: {
      [addr]: 10000
    },
    createdAt: Date.now(),
    invocations: [],
    emergencyHaltWallet: addr,
    halted: false,
    pairs: [],
    usedTransfers: [],
    foreignCalls: [],
    canEvolve: true,
    claims: [],
    claimable: [],
    settings: [["isTradeable", true]]
  })
})
console.log(
  await warp.contract(r.contractTxId).readState()

)
console.log(r)

