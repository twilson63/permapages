import { z } from 'zod'
import Async from 'crocks/Async/index.js';

import compose from 'ramda/src/compose'
import prop from 'ramda/src/prop'
import propEq from 'ramda/src/propEq'
import find from 'ramda/src/find'

const schema = z.object({
  id: z.string().optional(),
  code: z.string().optional(),
  type: z.literal('page').default('page'),
  owner: z.string().optional(),
  creator: z.string().optional(),
  contentType: z.literal('text/html').default('text/html'),
  subdomain: z.string().max(20).optional(),
  title: z.string().max(150),
  description: z.string().max(150),
  topics: z.array(z.string()).optional(),
  status: z.string().max(150).optional(),
  protocol: z.string().default('PermaPages-v0.5'),
  content: z.string(),
  html: z.string(),
  profile: z.boolean().default(false),
  weavemail: z.boolean().default(false),
  ethwallet: z.string().default(''),
  webpage: z.string().optional(),
  timestamp: z.string(),
  theme: z.string().default('default'),
  includeFooter: z.boolean().optional(),
  allowStamps: z.boolean().optional(),
  noContract: z.boolean().optional(),
  noBundlr: z.boolean().optional(),
  units: z.number().optional(),
  widgets: z.array(
    z.object({
      source: z.string(),
      elementId: z.string(),
      name: z.string(),
      description: z.string(),
      version: z.string().optional()
    })
  ).optional(),
  state: z.object({}).passthrough().optional()
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
    title: getTag('Page-Title')(tx.tags) || getTag('Title')(tx.tags) || '',
    status: getTag('Status')(tx.tags),
    webpage: getTag('Webpage')(tx.tags),
    protocol: getTag('Protocol')(tx.tags),
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