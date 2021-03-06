import { z } from 'zod'
import Async from 'crocks/Async/index.js';

import compose from 'ramda/src/compose'
import prop from 'ramda/src/prop'
import propEq from 'ramda/src/propEq'
import find from 'ramda/src/find'

const schema = z.object({
  id: z.string().optional(),
  type: z.literal('page').default('page'),
  owner: z.string(),
  contentType: z.literal('text/html').default('text/html'),
  subdomain: z.string().max(20).optional(),
  title: z.string().max(20),
  description: z.string().max(150),
  status: z.string().max(150).optional(),
  protocol: z.string().default('PermaPages-v0.3'),
  content: z.string(),
  html: z.string(),
  profile: z.boolean().default(false),
  weavemail: z.boolean().default(false),
  ethwallet: z.string().default(''),
  webpage: z.string().optional(),
  timestamp: z.string(),
  theme: z.string(),
  includeFooter: z.boolean(),
  widgets: z.array(
    z.object({
      source: z.string(),
      elementId: z.string(),
      name: z.string(),
      description: z.string()
    })
  ),
  state: z.object({
    ticker: z.string(),
    name: z.string(),
    title: z.string(),
    owner: z.string().optional(),
    balances: z.object({}).passthrough(),
    contentType: z.string(),
    createdAt: z.number(),
    stakes: z.object({}).passthrough().optional(),
    locked: z.boolean(),
    tags: z.array(z.string())
  }).optional()
})

const getTag = name => compose(
  prop('value'),
  find(propEq('name', name))
)

export const createPage = (data) => {
  data.timestamp = new Date().toISOString()
  const result = schema.safeParse(data)
  if (result.success) {
    return Async.Resolved(result.data)
  } else {
    return Async.Rejected(result.error.flatten())
  }
}

export const txToPage = (tx) => {
  const tsValue = getTag('Timestamp')(tx.tags)
  const timestamp = tsValue ? tsValue : new Date().toISOString()
  const page = {
    id: tx.id,
    owner: tx.owner.address,
    type: getTag('Type')(tx.tags) || 'page',
    title: getTag('Page-Title')(tx.tags),
    status: getTag('Status')(tx.tags),
    webpage: getTag('Webpage')(tx.tags),
    timestamp
  }
  return page
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