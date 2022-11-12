import { WarpFactory } from 'warp-contracts'
import fs from 'fs'

const warp = WarpFactory.forMainnet()
const src = fs.readFileSync('./dist/note.js', 'utf-8')
const wallet = JSON.parse(fs.readFileSync('../mywallet.json', 'utf-8'))

const result = await warp.createContract.deploy({
  wallet,
  src,
  initState: JSON.stringify({
    pairs: [],
    balances: {
      'vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI': 10000
    },
    creator: 'vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI',
    name: 'PERMANOTE',
    ticker: 'NOTE-TEST',
    canEvolve: true,
    title: 'My Awesome Post',
    description: 'A awesome description',
    topics: [],
    content: 'Enter Content here',
    updated: Date.now(),
    updatedBy: 'vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI',
    log: []
  })
})
console.log(result)