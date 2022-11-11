import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { handle } from '../src/note'

globalThis.ContractAssert = (test, msg) => {
  if (!test) {
    throw new Error(msg)
  }
}

const state = {
  pairs: [],
  balances: {
    'K92n-x2kHiRIBmS0yRGz5ii3OEXFw58__742Qu0DTgA': 10000
  },
  creator: 'K92n-x2kHiRIBmS0yRGz5ii3OEXFw58__742Qu0DTgA',
  name: 'PERMANOTE',
  ticker: 'NOTE',
  canEvolve: true,
  title: 'My Awesome Post',
  description: 'A awesome description',
  topics: [],
  content: 'Enter Content here',
  updated: Date.now(),
  updatedBy: 'K92n-x2kHiRIBmS0yRGz5ii3OEXFw58__742Qu0DTgA',
  log: []
}

test('test balance', async () => {
  const { result } = await handle(state, {
    caller: 'K92n-x2kHiRIBmS0yRGz5ii3OEXFw58__742Qu0DTgA',
    input: { function: 'balance' }
  }
  )
  assert.equal(result.balance, 10000)
})


test('test transfer', async () => {
  const result = await handle(state, {
    caller: 'K92n-x2kHiRIBmS0yRGz5ii3OEXFw58__742Qu0DTgA',
    input: { function: 'transfer', target: 'dHYOhv5oHsMqHL63uZ-advsOuT1DIpT3UXSvKfFOInM', qty: 100 }
  })

  assert.equal(result.state.balances['dHYOhv5oHsMqHL63uZ-advsOuT1DIpT3UXSvKfFOInM'], 100)
})


test('test evolve', async () => {
  const result = await handle(state, {
    caller: 'K92n-x2kHiRIBmS0yRGz5ii3OEXFw58__742Qu0DTgA',
    input: { function: 'evolve', value: 'dHYOhv5oHsMqHL63uZ-advsOuT1DIpT3UXSvKfFOInM' }
  })

  assert.equal(result.state.evolve, 'dHYOhv5oHsMqHL63uZ-advsOuT1DIpT3UXSvKfFOInM')

})

test('update success', async () => {

  const result = await handle(state, {
    caller: 'K92n-x2kHiRIBmS0yRGz5ii3OEXFw58__742Qu0DTgA',
    input: {
      function: 'update', data: {
        title: 'A New Title',
        description: 'A new description',
        content: '# Content',
        topics: []
      }, timestamp: Date.now()
    }
  })

  assert.equal(result.state.title, 'A New Title')
})

test('update failure not an owner', async () => {
  try {
    const result = await handle(state, {
      caller: 'CUbfBZ4AlBo8qReRYLIwCix6ysKWFpbN9TigruaEihg',
      input: {
        function: 'update', data: {
          title: 'A New Title',
          description: 'A new description',
          content: '# Content',
          topics: []
        }, timestamp: Date.now()
      }
    })

  } catch (e) {
    //console.log(e.message)
    assert.equal(e.message, 'Must be owner to update')
  }


})

test('update failure bad data', async () => {
  try {
    const result = await handle(state, {
      caller: 'K92n-x2kHiRIBmS0yRGz5ii3OEXFw58__742Qu0DTgA',
      input: {
        function: 'update', data: {
          title: 'A New Title',
          topics: []
        }, timestamp: Date.now()
      }
    })

  } catch (e) {
    //console.log(e.message)
    assert.equal(e.message, 'Data is required to update!')
  }


})

test.run()

