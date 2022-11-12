import { WarpFactory } from 'warp-contracts/mjs'
import fs from 'fs'

const warp = WarpFactory.forMainnet()
const src = fs.readFileSync('./dist/note.js', 'utf-8')
const wallet = JSON.parse(fs.readFileSync('../mywallet.json', 'utf-8'))


console.log(
  await warp.contract('73gIPqizmpKOs_NU89ROsO1vAqeUBsxjxRaZzOyFKCU')
    .connect(wallet)
    .setEvaluationOptions({
      internalWrite: true,
      allowUnsafeClient: true,
      allowBigInt: true,
      //useVM2: true
    })
    .readState()
)