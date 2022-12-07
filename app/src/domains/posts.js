import { Async } from 'crocks'


export default function ({ gql }) {
  function list(addr) {
    return Async.of(addr)
      .map(buildQuery)
      .chain(Async.fromPromise(gql))
    // get stamp count
    // transform to post-item

  }
  return {
    list
  }
}

function buildQuery(addr) {
  return {
    query: `query ($owners: [String!], $cursor: String) {
      transactions(first: 100 after: $cursor, owners: $owners, tags: { name: "Type", values: ["blog-post"] }) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            id
            tags {
              name
              value
            }
          }
        }
      }
    }`,
    variables: {
      owners: [addr]
    }
  }
}