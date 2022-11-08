import crocks from 'crocks'
import { z } from 'zod'
import { h } from 'hastscript'
import { toHtml } from 'hast-util-to-html'

const { ReaderT, Async } = crocks
const { of, ask, lift } = ReaderT(Async)

const CONTRACT_SOURCE = __ATOMIC_ASSET_SRC__
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
  title: z.string(),
  description: z.string(),
  topics: z.array(z.string()),
  content: z.string(),
  timestamp: z.number(),
  owners: z.array(z.string()),
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
    ask(({ warp, arweaveWallet }) =>
      Async.of(note)
        .chain(validateNote)
        .map(generateHtml)
        .chain(dispatch(arweaveWallet))
        .chain(post(warp))
    )
  ).chain(lift)

//.chain(validateNote)


// generate contract state
// generate html data
// dispatch to bundlr
// post to sequencer



export function get(id) {
  // read note from contract
  // return note
}

export function update(note) {

}

export function hx(id) {
  // get history from note

}

/** -------------- Below the fold -------------------------- */

function generateHtml(note) {
  const html = h('html',
    h('head',
      h('title', note.title),
      h('meta', { name: 'description', content: note.description })
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

function dispatch(arweave, arweaveWallet) {
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