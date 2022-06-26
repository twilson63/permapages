import { z } from 'zod'
import Async from 'crocks/Async/index.js';

import compose from 'ramda/src/compose'
import prop from 'ramda/src/prop'
import propEq from 'ramda/src/propEq'
import find from 'ramda/src/find'

const schema = z.object({
  id: z.string().optional(),
  type: z.literal('note').default('note'),
  owner: z.string(),
  contentType: z.literal('text/markdown').default('text/markdown'),
  slug: z.string().max(100),
  title: z.string().max(20),
  description: z.string().max(50),
  protocol: z.string().default('PermaNotes-v0.3'),
  content: z.string(),
  public: z.boolean().default(false),
  topic: z.string().optional(),
  timestamp: z.string(),
  likeContract: z.string().optional()
})

const getTag = name => compose(
  prop('value'),
  find(propEq('name', name))
)

export const createNote = (data) => {
  data.timestamp = new Date().toISOString()
  const result = schema.safeParse(data)
  if (result.success) {
    return Async.Resolved(result.data)
  } else {
    return Async.Rejected(result.error.flatten())
  }
}

export const txToNote = (tx) => {
  const tsValue = getTag('Timestamp')(tx.tags)
  const timestamp = tsValue ? tsValue : new Date().toISOString()
  const note = {
    id: tx.id,
    owner: tx.owner.address,
    type: getTag('Type')(tx.tags),
    title: getTag('Note-Title')(tx.tags),
    description: getTag('Description')(tx.tags),
    topic: getTag('Note-Topic')(tx.tags),
    rev: getTag('Note-Rev')(tx.tags),
    public: getTag('Note-Public')(tx.tags) === 'true' ? true : false,
    slug: getTag('Note-Title')(tx.tags).toLowerCase().replace(' ', '-'),
    timestamp
  }
  return note
}

export const validate = (data) => {
  data.timestamp = new Date().toISOString()
  const result = schema.safeParse(data)
  if (result.success) {
    return Async.Resolved(result.data)
  } else {
    return Async.Rejected(result.error.flatten())
  }
}