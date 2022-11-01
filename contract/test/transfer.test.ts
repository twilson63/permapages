import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { path } from 'ramda'

import { handle } from '../src/contract'
import {
  StateInterface,
  ActionInterface,
  BalanceInterface
} from "../src/faces";

globalThis.ContractError = Error

test('transfer happy path', async () => {
  const action: ActionInterface = { input: { function: 'transfer', target: 'xyz', qty: 100 }, caller: 'abc' }

  const r = await handle({
    balances: {
      'abc': 1000
    },
    creator: 'abc',
    ticker: 'ATOMIC-ASSET',
    claimable: [],
    claims: [],
    settings: [["isTradeable", true]],
    invocations: [],
    emergencyHaltWallet: '',
    halted: false,
    pairs: [],
    usedTransfers: [],
    foreignCalls: []
  }, action)

  assert.equal(path(['state', 'balances', 'abc'], r), 900)
  assert.equal(path(['state', 'balances', 'xyz'], r), 100)
})

test('transfer caller has no qty', async () => {
  try {
    await handle({
      balances: {
        'abc': 1000
      },
      creator: 'abc',
      ticker: 'ATOMIC-ASSET',
      claimable: [],
      claims: [],
      settings: [["isTradeable", true]],
      invocations: [],
      emergencyHaltWallet: '',
      halted: false,
      pairs: [],
      usedTransfers: [],
      foreignCalls: []
    }, { input: { function: 'transfer', target: 'xyz', qty: 100 }, caller: 'cbd' })
  } catch (e) {
    assert.equal(e.message, 'Caller doesn\'t own any balance.')
  }
})

test.run()