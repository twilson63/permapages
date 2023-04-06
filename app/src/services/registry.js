import Arweave from 'arweave'
import { WarpFactory, defaultCacheOptions, LoggerFactory } from 'warp-contracts/web'

import getHost from './get-host'

import { map, pluck, head, filter, compose, toPairs, equals, propOr, identity, path } from 'ramda'


let options = {}
options = { host: getHost(), port: 443, protocol: 'https' }
const arweave = Arweave.init(options)

LoggerFactory.INST.logLevel("error");
//const warp = WarpFactory.custom(arweave, defaultCacheOptions, 'mainnet').useArweaveGateway().build()
//const warp = WarpFactory.forMainnet({ arweave, useArweaveGw: true })
const warp = WarpFactory.forMainnet()
const REGISTRY = "bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U"
const ANT_SOURCE = "PEI1efYrsX08HUwvc6y-h6TSpsNlo2r6_fWL2_GdwhY"
//const ANT_SOURCE = "JIIB01pRbNK2-UyNxwQK-6eknrjENMTpTvQmB8ZDzQg"

export async function search(name) {
  const registry = warp.pst(REGISTRY).connect('use_wallet')
  const registryState = hydrate(await registry.currentState())

  if (registryState.records[name]) {
    return { ok: false, message: `This name ${name} is already taken and is not available for purchase` }
  }
  return { ok: true }
}
export async function register({ name, owner, transactionId }) {
  const registry = warp.pst(REGISTRY).connect('use_wallet')
  const registryState = hydrate(await registry.currentState())

  if (registryState.records[name]) {
    return { ok: false, message: `This name ${name} is already taken and is not available for purchase` }
  }

  const arnsBalance = registryState.balances[owner]

  if (typeof arnsBalance === 'undefined' || arnsBalance < registryState.fees[name.length]) {
    return { ok: false, message: `Not enough ArNS Test Token to purchase this subdomain.` }
  }

  // create ANT contract
  const ant = await warp.createContract.deployFromSourceTx({
    wallet: 'use_wallet',
    initState: JSON.stringify({
      ticker: `ANT-${name.toUpperCase()}`,
      name,
      owner,
      controller: owner,
      evolve: null,
      records: {
        ["@"]: transactionId
      },
      balances: {
        [owner]: 1
      }
    }),
    srcTxId: ANT_SOURCE
  }, true)


  // buy ArNS
  const res = await registry.writeInteraction({
    function: 'buyRecord',
    name,
    contractTxId: ant.contractTxId,
    tierNumber: 1,
    years: 1
  }, { disableBundling: true })



  return { ok: true, ant, message: `Successfully registred ${name}.arweave.net` }
}

export async function getARBalance(owner) {
  //const { data } = await arweave.api.get(`wallet/${owner}/balance`)
  const data = await fetch(`https://${getHost()}/wallet/${owner}/balance`)
    .then(res => res.text())

  return arweave.ar.winstonToAr(data)
  //return await arweave.wallets.getBalance(owner).then(x => arweave.ar.winstonToAr(x)).catch(e => 'N/A')

}

export async function getBalance(owner) {
  const registry = await warp.contract(REGISTRY).syncState('https://cache-2.permaweb.tools/contract', { validity: true })

  const result = await registry.readState().then(path(['cachedValue', 'state', 'balances', owner]))
    .catch(e => console.log(e.message))
  return result ?? 0
}

export async function getFees(subdomain = '') {
  if (subdomain === '') return [0, 0]
  const registry = warp.pst(REGISTRY).connect('use_wallet')
  const registryState = hydrate(await registry.currentState())
  const fee = (await arweave.api.get(`price/${subdomain.length}`)).data
  const price = registryState.fees[subdomain.length]
  return [price, arweave.ar.winstonToAr(fee)]
}

export async function listANTs(owner) {
  const regState = await warp.contract(REGISTRY)
    .syncState('https://cache-2.permaweb.tools/contract', { validity: true })
    .then(c => c.setEvaluationOptions({ allowBigInt: true }).readState())
    //.setEvaluationOptions({ allowBigInt: true }).readState()
    .then(path(['cachedValue', 'state']))
    .catch(e => console.log('ERROR', e.message))

  const query = {
    query: `
  query {
    transactions(first: 100, owners: ["${owner}"], tags: {name: "Contract-Src", values: [${regState.approvedANTSourceCodeTxs.map(s => `"${s}"`)}]}) {
      edges {
        node {
          id
        }
      }
    }
  }
      `
  }

  const result = await arweave.api.post('graphql', query)

  const ids = pluck('id', pluck('node', result.data.data.transactions.edges))

  const ants = await Promise.all(
    map(getANT, ids)
  )

  return Promise.resolve(ants.filter(rec => rec.subdomain !== 'not_defined'))
}

const valueEquals = v => ([key, value]) => equals(value.contractTxId, v)
const getSubdomain = (contract, records) => compose(
  head,
  propOr([null], 0),
  filter(valueEquals(contract)),
  toPairs
)(records)

export async function getANT(ANT) {
  let subdomain = 'not_defined'
  try {
    //const registry = warp.contract(REGISTRY)
    const ant = await warp.contract(ANT).syncState('https://cache-2.permaweb.tools/contract', { validity: true })

    //const regState = await registry.readState().then(path(['cachedValue', 'state']))

    //subdomain = getSubdomain(ANT, regState.records)
    const antState = await ant.readState().then(path(['cachedValue', 'state']))

    return { ...antState, id: ANT, subdomain: antState.name }
  } catch (e) {
    return { id: ANT, subdomain }
  }
}

export async function updateSubDomain({ ant, subdomain = '@', transactionId }) {
  const w = WarpFactory.forMainnet()
  const result = await w.contract(ant).connect('use_wallet')
    .writeInteraction({
      function: 'setRecord',
      subDomain: subdomain,
      transactionId
    }, { disableBundling: true, strict: true })

  console.log('CHG ', result)

  return { ok: true, id: result.originalTxId, message: 'successfully updated subdomain' }
}

export async function removeSubDomain({ ant, subdomain }) {

  await warp.pst(ant).connect('use_wallet')
    .writeInteraction({
      function: 'removeRecord',
      subDomain: subdomain
    })
  return { ok: true, message: 'successfully removed subdomain' }
}

export async function transfer(ANT, target) {
  const ant = warp.pst(ANT).connect('use_wallet')
  await ant.transfer({
    target,
    qty: 1
  })
  return { ok: true }
}

// utility functions
function hydrate(s) {
  return JSON.parse(JSON.stringify(s))
}

