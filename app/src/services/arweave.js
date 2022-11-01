import Arweave from 'arweave'
import Account from 'arweave-account'

import always from 'ramda/src/always'
import assoc from 'ramda/src/assoc'
import path from 'ramda/src/path'
import pluck from 'ramda/src/pluck'
import prop from 'ramda/src/prop'
import map from 'ramda/src/map'
import mergeAll from 'ramda/src/mergeAll'
import compose from 'ramda/src/compose'
import join from 'ramda/src/join'
import split from 'ramda/src/split'
import toLower from 'ramda/src/toLower'

import { ArweaveWebWallet } from "arweave-wallet-connector";
import { readContract, selectWeightedPstHolder } from 'smartweave'
import { Async } from 'crocks'

// PST for permanotes
//const PERMANOTE_PST = 'cwElAMnBqu2fp-TUsV9lBIZJi-DRZ5tQJgJqxhFjqNY'
//const CONTRACT_SRC = '0hTokSQ7m3DQujuVisZ-RzcU6hOY3-Uz2ZIh4Aa0nKY'
//const PAGE_SRC = 'OhGbHpgw-GIXhUaDZIzUjVm5rXWtd_2hrABWlB83rb8'
const WARP_URL = 'https://d1o5nlqr4okus2.cloudfront.net/gateway/contracts/deploy'
const PAGE_SRC = 'kSiq990WBHkz6uYO_1z7jylm3YbRrcpm7UfhYUb8Cg0'
//const DATAFI_PAGE_SRC = 'M7Z1ag4OBmW7D4fkYyUUGKTneIeCFoURESBKXJGBFXo'
//const DATAFI_PAGE_SRC = 'iSKCrc_-JoMmzk2Cqn2j2HAoYulmy_9Ni4rXiGSurfk'
//const DATAFI_PAGE_SRC = 'BzNLxND_nJEMfcLWShyhU4i9BnzEWaATo6FYFsfsO0Q'
const DATAFI_PAGE_SRC = __ATOMIC_ASSET_SRC__

const [APP_NAME, APP_VERSION, SDK, CONTENT_TYPE, CONTRACT_SRC, INIT_STATE] =
  ['App-Name', 'App-Version', 'SDK', 'Content-Type', 'Contract-Src', 'Init-State']

const FEE = '.004'
const arweaveAccount = new Account()

export const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

// global warp
const { WarpFactory, LoggerFactory } = window.warp
LoggerFactory.INST.logLevel("error");
const warp = WarpFactory.forMainnet()

let wallet = null

//--- Helper functions
const createDataEntry = data => Async.fromPromise(arweave.createTransaction.bind(arweave))({ data })
const addTags = tags => tx => {
  tags.map(({ name, value }) => tx.addTag(name, value))
  return tx
}

const sign = tx =>
  Async.fromPromise(arweave.transactions.sign.bind(arweave.transactions))(tx).map(always(tx))
const post = contractTx => Async.fromPromise(fetch)(WARP_URL, {
  method: 'POST',
  body: JSON.stringify({ contractTx }),
  headers: {
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
}).chain(response => response.ok ? Async.fromPromise(response.json.bind(response))() : Async.Rejected(response))

//--- end ---

export const connectApp = () => {
  wallet = new ArweaveWebWallet({
    name: 'permapages',
    logo: `${window.location.origin}/permapages_logo.svg`
  })
  console.log('wallet', wallet)

  wallet.setUrl('https://arweave.app')
  return wallet.connect()
}

//export const account = async (address) => await arweaveAccount.get(address)
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
export const handle = async (handle) => await arweaveAccount.get(handle)

export const loadPage = async (id) => {
  const { data } = await arweave.api.get(id)
  return data
}

export const loadProfile = async (id) => {
  const { data } = await arweave.api.get(id)
  return data
}

export const loadState = async (id) => {
  try {
    const contract = warp.contract(id)
    const { state } = await contract.readState()
    return state
  } catch (e) {
    return {}
  }
}

export const load = async (id) => {
  const { data } = await arweave.api.get(id)
  if (!data.public) {
    if (wallet) {
      const encryptedData = Object.values(data.content)
      const symmetricKeyBytes = new Uint8Array(encryptedData.slice(0, 512))
      const contentBytes = new Uint8Array(encryptedData.slice(512))
      const symmetricKey = await decryptRSA(symmetricKeyBytes)
      const decryptString = arweave.utils.bufferToString(
        await arweave.crypto.decrypt(contentBytes, symmetricKey)
      )
      data.content = decryptString
    } else {
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
  }
  return data
}

export const postWebpage = async (data) => {

  const dispatch = Async.fromPromise(window.arweaveWallet.dispatch.bind(window.arweaveWallet))

  const slugify = compose(
    toLower,
    join('-'),
    split(' ')
  )
  const initState = data.state || {
    ticker: 'PAGE-' + slugify(data.title),
    name: 'Permapage',
    title: data.title,
    creator: data.owner,
    balances: {
      [data.owner]: 10000
    },
    contentType: 'text/html',
    createdAt: Date.now(),
    invocations: [],
    emergencyHaltWallet: data.owner,
    halted: false,
    pairs: [],
    usedTransfers: [],
    foreignCalls: [],
    claims: [],
    claimable: [],
    settings: [["isTradeable", true]]
  }

  // create data-entry
  const de = {
    data: data.html,
    tags: [
      { name: APP_NAME, value: 'SmartWeaveContract' },
      { name: APP_VERSION, value: '0.3.0' },
      { name: SDK, value: 'RedStone' },
      { name: CONTENT_TYPE, value: 'text/html' },
      { name: CONTRACT_SRC, value: DATAFI_PAGE_SRC },
      { name: INIT_STATE, value: JSON.stringify(initState) },
      { name: 'Title', value: data.title },
      { name: 'Description', value: data.description },
      { name: 'Page-Code', value: data.code },
      { name: 'Type', value: 'page' }
    ]
  }

  // dispatch to bundlr
  return createDataEntry(de.data).map(addTags(de.tags)).chain(dispatch)
    // post to Warp 
    .chain(result => createDataEntry(de.data)
      .map(addTags(de.tags))
      .chain(sign)
      .map(assoc('id', result.id))
      .chain(post)
    )
    .map(prop('contractId'))
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
    if (wallet) {
      const contentEncoder = new TextEncoder()
      const contentBuffer = contentEncoder.encode(note.content)
      const keyBuffer = generateRandomBytes()
      const encryptedContent = await arweave.crypto.encrypt(contentBuffer, keyBuffer)
      const publicKey = await wallet.getPublicKey()
      const jwk = await buildPublicKey(publicKey)
      const encryptedKey = await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, jwk, keyBuffer)
      note.content = arweave.utils.concatBuffers([encryptedKey, encryptedContent])
    } else {
      // @ts-ignore
      // eslint-disable-next-line no-undef
      note.content = await arweaveWallet.encrypt(note.content, {
        algorithm: 'RSA-OAEP',
        hash: 'SHA-256'
      })
    }

  }

  // get target wallet
  // const contractState = await readContract(arweave, PERMANOTE_PST)
  // const holder = selectWeightedPstHolder(contractState.balances)

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

export const payment = async () => {
  const contractState = await readContract(arweave, CONTRACT_ID)
  const holder = selectWeightedPstHolder(contractState.balances)
  const fee = await arweave.createTransaction({
    target: holder,
    quantity: arweave.ar.arToWinston('.001')
  })
  await arweave.transactions.sign(fee)
  return await arweave.transactions.post(fee)
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

async function decryptRSA(data) {
  if (wallet != null) {
    console.log(wallet)
    // arweave.app Case
    // =========================================================================
    return await wallet.decrypt(data, { name: 'RSA-OAEP' });
  } else {
    // ArConnect Case
    // =========================================================================
    throw `Cannot perform RSA decryption with ArConnect`;
  }
}

function generateRandomBytes() {
  const array = new Uint8Array(256)
  return crypto.getRandomValues(array)
}

export async function buildPublicKey(pk) {
  console.log(pk)
  const keyData = {
    kty: 'RSA',
    e: 'AQAB',
    n: pk,
    alg: 'RSA-OAEP-256',
    ext: true,
  };

  const algo = {
    name: 'RSA-OAEP',
    hash: {
      name: 'SHA-256',
    },
  };

  return crypto.subtle.importKey('jwk', keyData, algo, false, ['encrypt']);
}
