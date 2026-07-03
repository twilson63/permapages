import Arweave from 'arweave'
import { parse, htmlify } from './atomic'

import path from 'ramda/src/path'
import pluck from 'ramda/src/pluck'
import prop from 'ramda/src/prop'
import map from 'ramda/src/map'
import compose from 'ramda/src/compose'
import join from 'ramda/src/join'
import split from 'ramda/src/split'
import toLower from 'ramda/src/toLower'
import getHost from './get-host'

import { Async } from 'crocks'
import { DeployPlugin } from 'warp-contracts-plugin-deploy'
import { WarpFactory, LoggerFactory } from 'warp-contracts'

const DATAFI_PAGE_SRC = __ATOMIC_ASSET_SRC__

const [APP_NAME, APP_VERSION, SDK, CONTENT_TYPE, CONTRACT_SRC, INIT_STATE] =
  ['App-Name', 'App-Version', 'SDK', 'Content-Type', 'Contract-Src', 'Init-State']

let _options = {}

_options = { host: getHost(), port: 443, protocol: 'https' }
export const arweave = Arweave.init(_options)

// global warp
//const { WarpFactory, LoggerFactory } = window.warp
LoggerFactory.INST.logLevel("error");
const warp = WarpFactory.forMainnet().use(new DeployPlugin())
const options = { allowBigInt: true, internalWrites: true, unsafeClient: 'allow' }

//--- Helper functions
const createDataEntry = data => Async.fromPromise(arweave.createTransaction.bind(arweave))({ data })
const addTags = tags => tx => {
  tags.map(({ name, value }) => tx.addTag(name, value))
  return tx
}

export const upload = async (file, addr) => {
  // check balance
  if ((file.buffer.byteLength + 10000 > 100000)) {
    try {
      const balance = await arweave.wallets.getBalance(addr)
      const { data } = await arweave.api.get(`price/${file.buffer.byteLength + 10000}`)
      if (data > balance) {
        return Promise.reject({ message: 'not enough $AR to upload' })
      }
    } catch (e) {
      return Promise.reject({ message: 'not enough $AR to upload' })
    }
  }
  const tx = await arweave.createTransaction({ data: file.buffer })
  tx.addTag('Content-Type', file.type)

  if (file.buffer.byteLength + 10000 < 100000) {
    const result = await arweaveWallet.dispatch(tx)
    tx.id = result.id
  } else {
    await arweave.transactions.sign(tx)
    await arweave.transactions.post(tx)
  }

  return `https://arweave.net/${tx.id}`

}

export const loadPage = async (id) => {
  const { data } = await arweave.api.get(id)
  if (typeof data === 'string') {
    return parse(data)
  }
  return data
}

export const loadProfile = async (id) => {
  const { data } = await arweave.api.get(id)
  return data
}

export const loadState = async (id) => {
  try {
    const contract = warp.contract(id)
    const state = await contract.setEvaluationOptions(options).readState().then(path(['cachedValue', 'state']))
    return state
  } catch (e) {
    console.log('state error', e)
    return {}
  }
}

export const load = async (id) => {
  const { data } = await arweave.api.get(id)
  if (!data.public) {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    data.content = await arweaveWallet.decrypt(
      new Uint8Array(Object.values(data.content)),
      {
        algorithm: "RSA-OAEP",
        hash: "SHA-256",
      }
    )
  }
  return data
}

export const postWebpage = async (page) => {
  const html = htmlify(page)
  const dispatch = Async.fromPromise(window.arweaveWallet.dispatch.bind(window.arweaveWallet))

  const slugify = compose(
    toLower,
    join('-'),
    split(' ')
  )

  const initState = page.state || {
    ticker: 'PERMAPAGE',
    name: page.title,
    title: page.title,
    description: page.description,
    creator: page.creator,
    balances: {
      [page.creator]: page.units || 100
    },
    contentType: 'text/html',
    createdAt: Date.now(),
    emergencyHaltWallet: page.owner,
    halted: false,
    claimable: [],
    settings: [["isTradeable", true]]
  }

  const topics = page.topics.map(t => ({
    name: `topic:${t}`,
    value: t
  }))

  // create data-entry
  const de = {
    data: html,
    tags: [
      { name: APP_NAME, value: 'SmartWeaveContract' },
      { name: APP_VERSION, value: '0.3.0' },
      { name: CONTENT_TYPE, value: 'text/html' },
      { name: CONTRACT_SRC, value: DATAFI_PAGE_SRC },
      { name: INIT_STATE, value: JSON.stringify(initState) },
      { name: 'Title', value: page.title },
      { name: 'Description', value: page.description },
      { name: 'Type', value: 'page' },
      { name: 'Protocol', value: page.protocol },
      { name: 'Timestamp', value: new Date().toISOString() },
      { name: 'Indexed-By', value: 'ucm' },
      { name: APP_NAME, value: 'PermaPages' },
      { name: "License", value: page.license }
    ].concat(topics)
  }
  de.tags = de.tags.concat(derivation(page))
  de.tags = de.tags.concat(commercial(page))
  de.tags = de.tags.concat(dataModelTraining(page))

  // dispatch to bundlr
  return createDataEntry(de.data).map(addTags(de.tags)).chain(dispatch)
    // register on warp
    .chain(result => Async.fromPromise(warp.register.bind(warp))(result.id, 'arweave'))
    .map(prop('contractTxId'))
    .toPromise()


}

// make generic way to deploy to arweave....
export const postProfileTx = async (profile, tags) => {
  const tx = await arweave.createTransaction({
    data: JSON.stringify(profile)
  })

  tx.addTag('Content-Type', 'application/json')
  tx.addTag('App-Name', 'PermaPages')
  map(t => tx.addTag(t.name, t.value), tags)
  tx.addTag('Timestamp', new Date().toISOString())

  let result = tx

  try {
    // try bundlr first
    result = await arweaveWallet.dispatch(tx)

    return result
  } catch (e) {

    // then arweave
    await arweave.transactions.sign(tx)
    await arweave.transactions.post(tx)
  }

  return result

}

export const postPageTx = async (page) => {
  const tx = await arweave.createTransaction({
    data: JSON.stringify(page),
    // Free to create notes
    // target: holder,
    // quantity: arweave.ar.arToWinston(FEE)
  })

  tx.addTag('Content-Type', 'application/json')
  tx.addTag('App-Name', 'PermaPages')
  tx.addTag('Protocol', page.protocol)
  tx.addTag('Page-Title', page.title)
  // tx.addTag('Description', page.description)
  // tx.addTag('Type', 'page')
  tx.addTag('Page-Code', page.code)
  tx.addTag('Status', page.status)
  tx.addTag('Webpage', page.webpage)
  tx.addTag('Timestamp', new Date().toISOString())

  let result = tx

  try {
    // try bundlr first
    result = await arweaveWallet.dispatch(tx)

    return result
  } catch (e) {
    // then arweave
    await arweave.transactions.sign(tx)
    await arweave.transactions.post(tx)
  }

  return result

}

export const postTx = async (note) => {

  // encrypt content if private
  if (!note.public) {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    note.content = await arweaveWallet.encrypt(note.content, {
      algorithm: 'RSA-OAEP',
      hash: 'SHA-256'
    })
  }

  const tx = await arweave.createTransaction({
    data: JSON.stringify(note),
    // Free to create notes
    // target: holder,
    // quantity: arweave.ar.arToWinston(FEE)
  })

  tx.addTag('Content-Type', 'application/json')
  tx.addTag('App-Name', 'PermaNotes')
  tx.addTag('Protocol', note.protocol)
  tx.addTag('Note-Title', note.title)
  tx.addTag('Description', note.description)
  tx.addTag('Note-Topic', note.topic)
  tx.addTag('Note-Rev', note.rev)
  tx.addTag('Note-Public', note.public ? "true" : "false")
  tx.addTag('Timestamp', new Date().toISOString())

  let result = tx

  try {
    // try bundlr first
    result = await arweaveWallet.dispatch(tx)

    return result
  } catch (e) {
    // then arweave
    await arweave.transactions.sign(tx)
    await arweave.transactions.post(tx)
  }

  return result

}

export const myNotes = async () => {
  // @ts-ignore
  // eslint-disable-next-line no-undef
  const owner = await arweaveWallet.getActiveAddress()
  const result = await arweave.api.post('graphql', {
    query: `
query {
  transactions(owners: ["${owner}"], tags: { name: "Protocol", values: ["PermaNotes-v0.1"]}) {
    edges {
      node {
        id
        owner {
          address
        }
        tags {
          name
          value
        }
      }
    }
  }
}
    `
  })
  return pluck('node', path(['data', 'data', 'transactions', 'edges'], result))
}

export const gql = (query) => arweave.api.post('graphql', { query })

export const waitfor = async (txId) => {
  let count = 0;
  let foundPost = null;

  while (!foundPost) {
    count += 1;
    console.log(`attempt ${count}`);
    await delay(2000 * count);
    const result = await arweave.api.post('graphql', {
      query: `
query {
  transaction(id: "${txId}") {
    id
  }
}
    `});

    if (result?.data?.data?.transaction) {
      foundPost = result.data.data.transaction.id === txId;
    }

    if (count > 1) {
      break; // could not find post
    }
  }
  return { id: txId, foundPost }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function derivation(page) {
  if (page.derivation) {
    let value = page.derivationValue
    if (page.derivationValue === "Allowed-With-RevenueShare") {
      value = `${value}-${page.derivationValuePlus}%`
    }
    if (page.derivationValue === "Allowed-With-Fee-One-Time") {
      value = `${value}-${page.derivationValuePlus}`
    }
    if (page.derivationValue === "Allowed-With-Fee-Monthly") {
      value = `${value}-${page.derivationValuePlus}`
    }
    return [{ name: 'Derivation', value }]
  }
  return []
}

function commercial(page) {
  if (page.commercial) {
    let value = page.commercialValue
    if (page.commercialValue === "Allowed-With-RevenueShare") {
      value = `${value}-${page.commercialValuePlus}%`
    }
    if (page.commercialValue === "Allowed-With-Fee-One-Time") {
      value = `${value}-${page.commercialValuePlus}`
    }
    if (page.commercialValue === "Allowed-With-Fee-Monthly") {
      value = `${value}-${page.commercialValuePlus}`
    }
    return [{ name: 'Commercial-Use', value }]
  }
  return []
}

function dataModelTraining(page) {
  if (page.dataModelTraining) {
    let value = page.dataModelTrainingValue
    if (page.dataModelTrainingValue === "Allowed-With-RevenueShare") {
      value = `${value}-${page.dataModelTrainingValuePlus}%`
    }
    if (page.dataModelTrainingValue === "Allowed-With-Fee-One-Time") {
      value = `${value}-${page.dataModelTrainingValuePlus}`
    }
    if (page.dataModelTrainingValue === "Allowed-With-Fee-Monthly") {
      value = `${value}-${page.dataModelTrainingValuePlus}`
    }
    return [{ name: 'Data-Model-Training', value }]
  }
  return []
}