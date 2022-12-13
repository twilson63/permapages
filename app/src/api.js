/**
 * Glue module connecting business logic with services
 * 
 */
import * as app from './app.js'
import { gql } from './services/gql.js'
import { getData, publish } from './services/assets.js'
import { query } from './services/sw-cache.js'
import { md } from './services/md.js'

const _posts = app.posts({ gql, query, getData, publish, md })

export const posts = {
  list: (addr) => _posts.list(addr).toPromise(),
  get: (id) => _posts.get(id).toPromise(),
  create: (post) => _posts.create(post).toPromise()
}