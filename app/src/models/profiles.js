import { z } from 'zod'
import Async from 'crocks/Async/index.js';

import compose from 'ramda/src/compose'
import prop from 'ramda/src/prop'
import propEq from 'ramda/src/propEq'
import find from 'ramda/src/find'

const schema = z.object({
  id: z.string().optional(),
  type: z.literal('profile').default('profile'),
  owner: z.string(),
  avatar: z.string(),
  name: z.string().max(20),
  bio: z.string().max(100),
  protocol: z.string().default('PermaProfile-v0.1'),
  links: z.object({
    etherium: z.string(),
    solana: z.string(),
    twitter: z.string(),
    linkedIn: z.string(),
    instagram: z.string(),
    youtube: z.string(),
    discord: z.string(),
    twitch: z.string(),
    facebook: z.string(),
    background: z.string(),

  }),
  timestamp: z.string(),
})

const getTag = name => compose(
  prop('value'),
  find(propEq('name', name))
)

export const createProfile = (data) => {
  data.timestamp = new Date().toISOString()
  const result = schema.safeParse(data)
  if (result.success) {
    return Async.Resolved(result.data)
  } else {
    return Async.Rejected(result.error.flatten())
  }
}

export const txToProfile = (tx) => {
  const tsValue = getTag('Timestamp')(tx.tags)
  const timestamp = tsValue ? tsValue : new Date().toISOString()
  const page = {
    id: tx.id,
    owner: tx.owner.address,
    type: getTag('Type')(tx.tags) || 'profile',
    name: getTag('Profile-Name')(tx.tags),
    bio: getTag('Profile-Bio')(tx.tags),
    webpage: getTag('Profile-Avatar')(tx.tags),

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