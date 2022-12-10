/**
 * Glue module connecting business logic with services
 * 
 */
import * as app from './app.js'
import { gql } from './services/gql.js'

const _posts = app.posts({ gql })

export const posts = {
  list: (addr) => _posts.list(addr).toPromise()
}