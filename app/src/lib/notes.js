import crocks from 'crocks'
import { z } from 'zod'
import { h } from 'hastscript'
import { toHtml } from 'hast-util-to-html'

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
    ask(({ warp }) =>
      Async.of(note)
        .chain(validateNote)
        .map(generateHtml)
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