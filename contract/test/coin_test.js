import { test } from 'uvu'
import * as assert from 'uvu/assert'
import Arweave from 'arweave'
import { WarpNodeFactory, LoggerFactory } from 'warp-contracts'
import fs from 'fs'

LoggerFactory.INST.logLevel('info')

const wallet = JSON.parse(fs.readFileSync('../mywallet.json', 'utf-8'))

const arweave = Arweave.init({
  host: 'localhost',
  port: 1984,
  protocol: 'http'
})

const warp = WarpNodeFactory.forTesting(arweave)

const contractId = "nM0QMQJjOxSpYOiOJVgioyB8KFzCOc3ytGiHmPT_P78"

test('coin test', async () => {
  const contract = await warp.contract(contractId).connect(wallet)

  const result = await contract.writeInteraction({
    function: 'reward',
    stampContract: '1234'
  })

  console.log(result)
  const { state } = await contract.readState()
  console.log(state)
  assert.ok(true)

})

test.run()