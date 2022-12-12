import Arweave from 'arweave'
import { map } from 'ramda'

//const URL = 'https://gateway.redstone.finance/gateway/contracts/deploy'
const URL = 'https://d1o5nlqr4okus2.cloudfront.net/gateway/contracts/deploy'
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

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
    .then(asset => Promise.all([
      dispatch(asset.source),
      dispatch(asset.asset)
    ]))
    .then(([_, asset]) => asset)
    .then(post)
    .then(x => (console.log('asset', x), x))
}

async function dispatch({ data, tags }) {
  if (!arweaveWallet) {
    return Promise.reject('No wallet found')
  }
  console.log({ data, tags })
  const tx = await arweave.createTransaction({ data })
  map(t => tx.addTag(t.name, t.value), tags)

  const result = await arweaveWallet.dispatch(tx)
  return { data, tags, id: result.id }
}

async function post({ data, tags, id }) {
  if (!fetch) {
    return Promise.reject('fetch is required!')
  }
  const tx = await arweave.createTransaction({ data })
  map(t => tx.addTag(t.name, t.value), tags)

  await arweave.transactions.sign(tx, 'use_wallet')
  tx.id = id
  //console.log('tx: ', tx)
  const res = await fetch(URL, {
    method: 'POST',
    body: JSON.stringify({ contractTx: tx }),
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }).then(res => res.ok ? res.json() : Promise.reject(res))

  return { id, ...res }
}