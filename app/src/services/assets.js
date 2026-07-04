import Arweave from 'arweave'
import { map } from 'ramda'
import getHost from './get-host'

let options = {}

options = { host: getHost(), port: 443, protocol: 'https' }
const arweave = Arweave.init(options)

export const getData = (id) => arweave.api.get(id)

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
