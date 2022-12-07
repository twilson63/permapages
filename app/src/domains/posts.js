import { Async } from 'crocks'
import { assoc, pluck } from 'ramda'

export default function ({ gql, query }) {
  function list(addr) {
    return Async.of(addr)
      .map(buildQuery)
      .chain(Async.fromPromise(gql))
      .map(pluck('node'))
      .chain(nodes =>
        Async.fromPromise(query)(STAMP_CONTRACT, ['compose',
          ['mapObjIndexed', ['length']],
          ['groupBy', ['prop', 'asset']],
          // would be nice to filter only the assets from nodes
          ['filter', ['flip', ['includes']], pluck('id', nodes)],
          ['values'],
          ['prop', 'stamps']
        ])
          .map(counts => map(
            n => assoc('count', counts[n.id], n),
            nodes
          ))
      )
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