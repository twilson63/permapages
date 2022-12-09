import { Async } from 'crocks'
import { assoc, pluck } from 'ramda'

const APP_WALLET = 'K92n-x2kHiRIBmS0yRGz5ii3OEXFw58__742Qu0DTgA'
const SRC = 'x0ojRwrcHBmZP20Y4SY0mgusMRx-IYTjg5W8c3UFoNs'

export default function ({ gql, query, publish }) {
  function create(post) {
    return Async.of(post)
      .map(p => assoc('id', crypto.randomUUID(), p))
      // validate post
      .map(post => {
        return {
          asset: {
            data: post.html,
            tags: [
              { name: 'Content-Type', value: 'text/html' },
              { name: 'App-Name', value: 'SmartWeaveContract' },
              { name: 'Title', value: post.title },
              { name: 'Description', value: post.description },
              { name: 'Type', value: 'blog-post' },
              { name: 'Asset-Id', value: post.id },
              { name: 'App-Version', value: '0.3.0' },
              { name: 'Contract-Src', value: SRC },
              {
                name: 'Init-State', value: JSON.stringify({
                  balances: {
                    [post.owner]: 990000,
                    [APP_WALLET]: 1000
                  },
                  pairs: [],
                  name: "Post-" + post.id,
                  ticker: "BLOG-POST",
                  settings: [['isTradeable', true]]
                })
              }
            ]
          },
          source: {
            data: post.content,
            tags: [
              { name: 'Content-Type', value: 'text/markdown' },
              { name: 'App-Name', value: 'Permapages' },
              { name: 'Title', value: post.title },
              { name: 'Description', value: post.description },
              { name: 'Type', value: 'post-source' },
              { name: 'Asset-Id', value: post.assetId }
            ]
          }
        }
      })
      .chain(Async.fromPromise(publish))
    /**
     * Need to create a blog post this post should be joined by a unique code identifier
     * the post will write two transactions, one transaction will be stored as the atomic
     * asset page and the other as the source markdown page.
     * 
     * 
     */
  }
  function list(addr) {
    return Async.of(addr)
      .map(buildQuery)
      .chain(Async.fromPromise(gql))
    // .map(pluck('node'))
    // .chain(nodes =>
    //   Async.fromPromise(query)(STAMP_CONTRACT, ['compose',
    //     ['mapObjIndexed', ['length']],
    //     ['groupBy', ['prop', 'asset']],
    //     // would be nice to filter only the assets from nodes
    //     ['filter', ['flip', ['includes']], pluck('id', nodes)],
    //     ['values'],
    //     ['prop', 'stamps']
    //   ])
    //     .map(counts => map(
    //       n => assoc('count', counts[n.id], n),
    //       nodes
    //     ))
    // )
    // get stamp count
    // transform to post-item

  }
  return {
    list,
    create
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