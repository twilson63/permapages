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
      "ticker": "TEST-BARv4",
      "name": "TEST-BARv4",
      "balances": {
        [addr]: 100000000000,
        'hB-g6Eed6n_26f5yj8geR3WjO5khTfYIPrLopJgND0Y': 100000000000,
        'vLRHFqCw1uHu75xqB4fCDW-QxpkpJxBtFD9g4QYUbfw': 100000000000
      },
      "settings": [
        ["communityLogo", "_32hAgwNt4ZVPisYAP3UQNUbwi_6LPUuZldPFCLm0fo"],
        ["isTradeable", true]
      ],
      "divisibility": 6,
      "claims": [],
      "claimable": [],
    })
  }, true)

  console.log(result)
}

main()