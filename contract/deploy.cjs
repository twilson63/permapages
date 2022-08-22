const Arweave = require('arweave')
const { WarpNodeFactory } = require('warp-contracts')
const fs = require('fs')

const source = fs.readFileSync('./dist/contract.js', 'utf-8')
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
      ticker: 'PAGE-EXAMPLE',
      name: 'PAGE Example Contract',
      title: 'Contract Example',
      owner: addr,
      balances: {
        [addr]: 10000
      },
      createdAt: Date.now(),
      contentType: 'text/html',
      invocations: [],
      emergencyHaltWallet: addr,
      halted: false,
      pairs: [],
      usedTransfers: [],
      foreignCalls: [],
      claims: [],
      claimable: [],
      settings: [["isTradeable", true]]
    }),
    data: { 'Content-Type': 'text/html', body: '<h1>Test</h1>' }
  }, true)

  console.log(result)
}

main()