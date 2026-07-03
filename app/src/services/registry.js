/**
 * ArNS service on the AR.IO network (AO era).
 *
 * Names live in the ARIO mainnet process; each name's records live in an
 * ANT (an AO process owned by the user). Reads go through the AR.IO SDK's
 * remote CU; writes are signed by the connected Wander wallet.
 *
 * Name purchases moved to arns.arweave.net — the in-app purchase flow is
 * retired and links out instead.
 */
import getHost from './get-host'

const ARNS_PORTAL = 'https://arns.arweave.net'

// the AR.IO SDK (and its AO/bundling deps) is ~880KB gzipped — load it only
// when an ArNS screen actually needs it, never on app boot
let sdkPromise = null
const sdk = () => {
  sdkPromise = sdkPromise || import('@ar.io/sdk/web')
  return sdkPromise
}
const getArio = async () => {
  const { ARIO } = await sdk()
  return ARIO.mainnet()
}
const getAnt = async (processId, withSigner = false) => {
  const { ANT, ArconnectSigner } = await sdk()
  return ANT.init(withSigner
    ? { processId, signer: new ArconnectSigner(globalThis.arweaveWallet) }
    : { processId })
}

export async function search(name) {
  try {
    const ario = await getArio()
    const record = await ario.getArNSRecord({ name })
    if (record) {
      return { ok: false, message: `This name ${name} is already taken and is not available for purchase` }
    }
    return { ok: true }
  } catch (e) {
    return { ok: true }
  }
}

export async function register() {
  return {
    ok: false,
    message: `ArNS name registration has moved to the AR.IO network portal — visit ${ARNS_PORTAL} to lease or buy a name, then link it to your page here.`
  }
}

export async function getARBalance(owner) {
  const winston = await fetch(`https://${getHost()}/wallet/${owner}/balance`)
    .then(res => res.text())
  return (Number(winston) / 1e12).toFixed(6)
}

// ARIO token balance (replaces the retired ArNS test-token balance)
export async function getBalance(owner) {
  try {
    const ario = await getArio()
    const mARIO = await ario.getBalance({ address: owner })
    return Number((mARIO / 1e6).toFixed(2))
  } catch (e) {
    return 0
  }
}

export async function getFees(subdomain = '') {
  if (subdomain === '') return [0, 0]
  const fee = await fetch(`https://${getHost()}/price/${subdomain.length}`).then(res => res.text())
  return [0, (Number(fee) / 1e12).toFixed(6)]
}

export async function listANTs(owner) {
  const ario = await getArio()
  const { items } = await ario.getArNSRecordsForAddress({ address: owner, limit: 1000 })

  // one ANT process can back several names — read each process once
  const byProcess = items.reduce((acc, item) => {
    acc[item.processId] = acc[item.processId] || []
    acc[item.processId].push(item)
    return acc
  }, {})

  const ants = await Promise.all(
    Object.entries(byProcess).map(async ([processId, names]) => {
      try {
        const ant = await getAnt(processId)
        const [info, records] = await Promise.all([ant.getInfo(), ant.getRecords()])
        return names.map(({ name }) => ({
          id: processId,
          name,
          subdomain: name,
          ticker: info.Ticker || `ANT-${name.toUpperCase()}`,
          owner: info.Owner,
          records
        }))
      } catch (e) {
        return names.map(({ name }) => ({ id: processId, name, subdomain: name, records: {} }))
      }
    })
  )

  return ants.flat().filter(rec => rec.subdomain !== 'not_defined')
}

export async function getANT(processId) {
  try {
    const ant = await getAnt(processId)
    const [info, records] = await Promise.all([ant.getInfo(), ant.getRecords()])
    return {
      id: processId,
      name: info.Name,
      subdomain: info.Name,
      ticker: info.Ticker,
      owner: info.Owner,
      records
    }
  } catch (e) {
    return { id: processId, subdomain: 'not_defined', records: {} }
  }
}

export async function updateSubDomain({ ant, subdomain = '@', transactionId }) {
  try {
    const client = await getAnt(ant, true)
    const result = subdomain === '@'
      ? await client.setBaseNameRecord({ transactionId, ttlSeconds: 900 })
      : await client.setUndernameRecord({ undername: subdomain, transactionId, ttlSeconds: 900 })
    return { ok: true, id: result.id, message: 'successfully updated subdomain' }
  } catch (e) {
    return { ok: false, message: e.message || 'could not update subdomain' }
  }
}

export async function removeSubDomain({ ant, subdomain }) {
  try {
    const client = await getAnt(ant, true)
    await client.removeUndernameRecord({ undername: subdomain })
    return { ok: true, message: 'successfully removed subdomain' }
  } catch (e) {
    return { ok: false, message: e.message || 'could not remove subdomain' }
  }
}

export async function transfer(ant, target) {
  try {
    const client = await getAnt(ant, true)
    await client.transfer({ target })
    return { ok: true }
  } catch (e) {
    return { ok: false, message: e.message || 'could not transfer ANT' }
  }
}
