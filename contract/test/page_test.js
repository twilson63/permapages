import { test } from 'uvu'
import * as assert from 'uvu/assert'
import Arweave from 'arweave'
import { WarpNodeFactory, LoggerFactory } from 'warp-contracts'
import fs from 'fs'

LoggerFactory.INST.logLevel('error')

const wallet = JSON.parse(fs.readFileSync('../mywallet.json', 'utf-8'))
const SRC = fs.readFileSync('./page-contract.js', 'utf-8')


const arweave = Arweave.init({
  host: 'localhost',
  port: 1984,
  protocol: 'http'
})

const w2 = await arweave.wallets.generate()
const w2Addr = await arweave.wallets.jwkToAddress(w2)
await arweave.api.get(`mint/${w2Addr}/${arweave.ar.arToWinston('100')}`)

const warp = WarpNodeFactory.forTesting(arweave)

const initialState = {
  title: 'Web Page',
  description: 'A Web page description',
  name: 'WebPagePoAP',
  ticker: 'PAGE-TEST',
  balances: {},
  views: {},
  tags: [],
  contentType: 'text/html'
}
const result = await warp.createContract.deploy({
  src: SRC,
  initState: JSON.stringify(initialState),
  wallet,
  data: {"Content-Type": 'text/html', body: '<h1>Hello World</h1>'}
})

console.log(result)
await arweave.api.get('mine')

const contractId = result.contractTxId


test('test contract view count', async () => {
  // view page
  const contract = await warp.contract(contractId).connect(wallet)

  await contract.writeInteraction({
    function: 'view'
  })
  
  const contract2 = await warp.contract(contractId).connect(w2)

  await contract2.writeInteraction({
    function: 'view'
  })

  await arweave.api.get('mine')
  assert.ok(true)

  // get count
  const r = await contract.viewState({
    function: 'viewCount'
  })

  assert.equal(r.result, 2)

})


test('test contract view count', async () => {
  // view page
  const contract = await warp.contract(contractId).connect(wallet)

  await contract.writeInteraction({
    function: 'mint'
  })
  
  const contract2 = await warp.contract(contractId).connect(w2)

  await contract2.writeInteraction({
    function: 'mint'
  })

  await arweave.api.get('mine')
  assert.ok(true)

  // get balance
  const r = await contract.viewState({
    function: 'balance'
  })

  assert.equal(r.result.balance, 1)

  const r2 = await contract2.viewState({
    function: 'balance'
  })

  assert.equal(r2.result.balance, 1)

})

test.run()