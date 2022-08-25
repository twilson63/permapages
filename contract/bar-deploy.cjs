const Arweave = require('arweave')
const { WarpNodeFactory } = require('warp-contracts')
const fs = require('fs')

const source = fs.readFileSync('./dist/bar.js', 'utf-8')
const wallet = JSON.parse(fs.readFileSync('../mywallet.json', 'utf-8'))

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

async function main() {


  const addr = await arweave.wallets.jwkToAddress(wallet)
  const warp = WarpNodeFactory.memCached(arweave)

  const result = await warp.createContract.deploy({
    wallet,
    src: source,
    initState: JSON.stringify({
      ticker: 'TEST-BARv2',
      owner: addr,
      balances: {
        [addr]: Number(arweave.ar.arToWinston('100'))
      },
      createdAt: Date.now(),
      invocations: [],
      emergencyHaltWallet: addr,
      halted: false,
      pairs: [],
      usedTransfers: [],
      foreignCalls: [],
      claims: [],
      claimable: [],
      settings: [["isTradeable", true]]
    })
  }, true)

  console.log(result)
}

main()