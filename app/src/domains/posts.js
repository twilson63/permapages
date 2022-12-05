import { Async } from 'crocks'

export default function ({ gql }) {
  function list(addr) {
    return of(addr)
      .map(buildQuery)
      .chain(gql)
  }
  return {
    list
  }
}

function buildQuery(addr) {
  return `query {
  transactions(first: 100, owner: ["${addr}"], tags: { name: "Type", value: "blog-post" }) {
    edges {
      node {
        id
        tag {
          name
          value
        }
      }
    }
  }
}`
}