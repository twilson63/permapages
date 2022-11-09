import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { WarpFactory } from 'warp-contracts/mjs'
import { create } from './notes.js'
import Arweave from 'arweave'
import fetch from 'node-fetch'
import crypto from 'crypto'


const CONTRACT_GATEWAY = 'https://gateway.redstone.finance/gateway/contracts/deploy'
const CONTRACT_SOURCE = "x0ojRwrcHBmZP20Y4SY0mgusMRx-IYTjg5W8c3UFoNs"

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

const warp = WarpFactory.forMainnet()

test('create a note', async () => {
  const result = await create({
    title: 'Test Post',
    description: 'A test post',
    topics: ['test', 'dev'],
    content: '# Hello World',
    balances: { 'vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI': 10000 },
    timestamp: Date.now()
  }).runWith({ arweave, warp, fetch, randomUUID: crypto.randomUUID, CONTRACT_GATEWAY, CONTRACT_SOURCE }).toPromise().catch(r => {
    console.log(r)
    return { ok: false }
  })

  console.log(result)
  assert.ok(result.ok)
})

test.run()