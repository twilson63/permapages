import Arweave from 'arweave'
import { map } from 'ramda'
import { DeployPlugin } from 'warp-contracts-plugin-deploy'
import { WarpFactory, LoggerFactory } from 'warp-contracts'
import getHost from './get-host'

let options = {}

options = { host: getHost(), port: 443, protocol: 'https' }
const arweave = Arweave.init(options)

LoggerFactory.INST.logLevel('error')
const warp = WarpFactory.forMainnet().use(new DeployPlugin())

export const getData = (id) => arweave.api.get(id)
//.then(res => res.ok ? res.data : Promise.reject(res))

/**
 * @typedef {object} Tag
 * @property {string} name
 * @property {string} value
 * 
 * @typedef {object} Transaction
 * @property {ArrayBuffer} data
 * @property {Tag[]} tags
 * 
 * @typedef {object} AssetPage
 * @property {Transaction} asset
 * @property {Transaction} source
 * 
 */

/**
 * @param {AssetPage} asset
 */
export const publish = (asset) => {
  return Promise.resolve(asset)
    .then(asset => dispatch(asset.asset))
    //.then(asset => new Promise(resolve => setTimeout(() => resolve(asset), 5000)))
    .then(result => warp.register(result.id, 'arweave'))
  //.then(({ contractTxId }) => assoc('id', contractTxId, asset))
  //.then(([_, asset]) => asset)
  //.then(post)
  //.then(x => (console.log('asset', x), x))
}

async function dispatch({ data, tags }) {
  if (!globalThis.arweaveWallet) {
    return Promise.reject('No wallet found')
  }

  const tx = await arweave.createTransaction({ data })
  map(t => tx.addTag(t.name, t.value), tags)

  const result = await globalThis.arweaveWallet.dispatch(tx)
  return { data, tags, id: result.id }
}
