import Arweave from 'arweave'

import map from 'ramda/src/map'
import pluck from 'ramda/src/pluck'
import head from 'ramda/src/head'
import filter from 'ramda/src/filter'
import compose from 'ramda/src/compose'
import toPairs from 'ramda/src/toPairs'
import equals from 'ramda/src/equals'
import propOr from 'ramda/src/propOr'

const { WarpWebFactory, LoggerFactory } = window.warp

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

LoggerFactory.INST.logLevel("error");
const warp = WarpWebFactory.memCachedBased(arweave).useArweaveGateway().build()

const REGISTRY = "bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U"
const ANT_SOURCE = "JIIB01pRbNK2-UyNxwQK-6eknrjENMTpTvQmB8ZDzQg"

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

  if (registryState.balances[owner] < registryState.fees[name.length]) {
    return { ok: false, message: `Not enough ArNS Test Token to purchase this subdomain.` }
  }

  // create ANT contract
  const ant = await warp.createContract.deployFromSourceTx({
    wallet: 'use_wallet',
    initState: JSON.stringify({
      ticker: `ANT-${name.toUpperCase()}`,
      name,
      owner,
      evolve: null,
      records: {
        ["@"]: transactionId
      },
      balances: {
        [owner]: 1
      }
    }),
    srcTxId: ANT_SOURCE
  })


  // buy ArNS
  const res = await registry.writeInteraction({
    function: 'buyRecord',
    name,
    contractTransactionId: ant
  })



  return { ok: true, ant, message: `Successfully registred ${name}.arweave.net` }
}

export async function getARBalance(owner) {
  const { data } = await arweave.api.get(`wallet/${owner}/balance`)
  return arweave.ar.winstonToAr(data)
  //return await arweave.wallets.getBalance(owner).then(x => arweave.ar.winstonToAr(x)).catch(e => 'N/A')

}

export async function getBalance(owner) {
  const registry = warp.pst(REGISTRY)

  const { result } = await registry.viewState({
    function: 'balance',
    target: owner
  })

  return result
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
  const registry = warp.pst(REGISTRY)
  const regState = await registry.currentState()
  //owner = 'j-Jvcg4_ZJ3BSANoJi-ixLWfxe3-nguaxNyg0lYy8P0'
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

  return Promise.resolve(ants.filter(rec => rec.subdomain !== null))

}

const valueEquals = v => ([key, value]) => equals(value, v)
const getSubdomain = (contract, records) => compose(
  head,
  propOr([null], 0),
  filter(valueEquals(contract)),
  toPairs
)(records)

export async function getANT(ANT) {
  let subdomain = 'not_defined'
  try {
    const registry = warp.pst(REGISTRY)
    const ant = warp.pst(ANT)
    const regState = await registry.currentState()

    subdomain = getSubdomain(ANT, regState.records)

    return { ...(await ant.currentState()), id: ANT, subdomain }
  } catch (e) {
    return { id: ANT, subdomain }
  }
}

export async function updateSubDomain(ANT, transactionId) {
  const ant = warp.pst(ANT).connect('use_wallet')
  await ant.writeInteraction({
    function: 'setRecord',
    subDomain: '@',
    transactionId
  })
  return { ok: true }
}

export async function removeSubDomain(ANT, subDomain) {
  
  const ant = warp.pst(ANT).connect('use_wallet')
  await ant.writeInteraction({
    function: 'removeRecord',
    subDomain
  })
  return { ok: true }
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

