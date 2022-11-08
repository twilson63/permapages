import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { WarpFactory } from 'warp-contracts/mjs'
import { create } from './notes.js'

const warp = WarpFactory.forMainnet()

test('create a note', async () => {
  const result = await create({
    title: 'Test Post',
    description: 'A test post',
    topics: ['test', 'dev'],
    content: '# Hello World',
    owners: ['vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI'],
    timestamp: Date.now()
  }).runWith({ warp }).toPromise().catch(r => {
    console.log(r)
    return { ok: false }
  })

  console.log(result)
  assert.ok(result.ok)
})

test.run()