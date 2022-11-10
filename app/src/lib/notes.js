import crocks from 'crocks'
import { z } from 'zod'
import { h } from 'hastscript'
import { toHtml } from 'hast-util-to-html'
import { assoc, join, keys, over, lensProp } from 'ramda'

const { ReaderT, Async } = crocks
const { of, ask, lift } = ReaderT(Async)

/**
 * Notes SDK
 * 
 * This library contains all the business rules for the permanotes API.
 * 
 * Methods:
 * 
 * * create
 * * update
 * * get
 * * history
 * 
 */
const Note = z.object({
  id: z.string().optional(),
  type: z.string().default('post'),
  title: z.string(),
  code: z.string(),
  description: z.string(),
  topics: z.array(z.string()),
  content: z.string(),
  timestamp: z.number(),
  balances: z.record(z.string().min(43).max(43), z.number()),
  html: z.string().optional()
})

const validateNote = (note) => {
  const { success, data, error } = Note.safeParse(note)
  return success ? Async.Resolved(data) : Async.Rejected(error)
}

/**
 * @param {Note} note
 * @returns {AsyncReader}
 */
export const create = (note) => of(note)
  .chain(note =>
    ask((env) =>
      Async.of(note)
        .map(over(lensProp('code'), () => randomUUID()))
        .chain(validateNote)
        .map(generateHtml)
        .chain(dispatch(env))
        .chain(post(env))
    )
  ).chain(lift)

export const get = (id) => of(id)
  .chain(id => ask(env => Async.of(id)
    .chain(getNote(env))
    .chain(validateNote)

  )).chain(lift)


export function update(note) {
  // write interaction to contract
  of(note)
    .chain(note => ask(env => Async.of(note)
      .chain(validateNote)
      .chain(postUpdate(env))
      // check if true then readState?
    ))

}

export function hx(id) {
  // get history from note
  // get the log of the note.
}

/** -------------- Below the fold -------------------------- */

/**
 * @returns {function}
 */
function getNote({ warp }) {
  /**
   * @returns {Async}
   */
  return function (id) {
    const readState = Async.fromPromise(warp.contract(id).readState)
    return readState()
  }
}

function generateHtml(note) {
  const html = h('html',
    h('head',
      h('title', note.title),
      h('meta', { name: 'description', content: note.description }),
      h('meta', { name: 'code', content: note.code }),
      h('meta', { name: 'authors', content: join(',', keys(node.balances)) })
    ),
    h('body',
      h('h1', note.title),
      h('h2', note.description),
      h('div', note.content)
    )
  )
  note.html = toHtml(html)
  return note

}

function dispatch({ arweave, arweaveWallet, CONTRACT_SOURCE }) {
  const createTx = Async.fromPromise(arweave.createTransaction.bind(arweave))
  const runDispatch = Async.fromPromise(arweaveWallet.dispatch.bind(arweaveWallet))
  return function (note) {
    return createTx({ data: note.html })
      .map(tx => {
        tx.addTag('Content-Type', 'text/html')
        tx.addTag('App-Name', 'SmartWeaveContract')
        tx.addTag('App-Version', '0.3.0')
        tx.addTag('Contract-Src', CONTRACT_SOURCE)
        tx.addTag('Init-State', JSON.stringify(note))
        tx.addTag('Title', note.title)
        tx.addTag('Description', note.description)
        tx.addTag('Type', note.type)
        return tx
      })
      .chain(tx => runDispatch(tx).map(_ => tx.id))
      .map(id => assoc('id', id, note))
  }
}

function post({ arweave, fetch, CONTRACT_SOURCE, CONTRACT_GATEWAY }) {
  const createTx = Async.fromPromise(arweave.createTransaction.bind(arweave))
  const signTx = Async.fromPromise(arweave.transactions.sign.bind(arweave.transactions))

  const deployContract = tx => Async.fromPromise(fetch)(CONTRACT_GATEWAY, {
    method: 'POST',
    body: JSON.stringify({ contractTx: tx }),
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })

  return function (note) {
    return createTx({ data: note.html })
      .map(tx => {
        tx.addTag('Content-Type', 'text/html')
        tx.addTag('App-Name', 'SmartWeaveContract')
        tx.addTag('App-Version', '0.3.0')
        tx.addTag('Contract-Src', CONTRACT_SOURCE)
        tx.addTag('Init-State', JSON.stringify(note))
        tx.addTag('Title', note.title)
        tx.addTag('Description', note.description)
        tx.addTag('Type', note.type)
        return tx
      })
      .chain(signTx)
      .map(assoc('id', note.id))
      .chain(deployContract)


  }
}

function postUpdate({ warp }) {
  return function (note) {
    const c = warp.contract(note.id).setEvaluationOptions({ internalWrites: true })
    const write = Async.fromPromise(c.writeInteraction.bind(c))
    return write({
      function: 'update',
      note,
      timestamp: Date.now()
    })
  }
}