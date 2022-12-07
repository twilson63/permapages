import { path } from 'ramda'
const URL = 'https://arweave.net'


const run = ({ query, variables }) => fetch(`${URL}/graphql`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query, variables })
}).then(res => res.ok ? res.json() : Promise.reject(res))

/**
  @typedef {object} GQLInput
  @property {string} query
  @property {record<string, any>} variables
*/
/**
  @param {GQLInput} q
*/
export const gql = async (q) => {
  console.log('q', q)
  let hasNextPage = true;
  let edges = []
  let cursor = ""

  while (hasNextPage) {
    const result = await run({ query: q.query, variables: { ...q.variables, cursor } })
      .then(path(['data', 'transactions']))

    if (result.edges && result.edges.length) {
      edges = edges.concat(result.edges)
      cursor = result.edges[result.edges.length - 1].cursor
    }
    hasNextPage = result.pageInfo.hasNextPage
  }

  return edges
}