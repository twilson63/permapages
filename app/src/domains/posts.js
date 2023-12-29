import { parseHTML } from 'linkedom/worker'
import { Async } from 'crocks'
import { assoc, lens, lensProp, trim, split, over, identity, compose, prop, filter, find, path, propEq, map, pluck, __, head, uniqBy, join, omit } from 'ramda'
import { encode, decode } from 'js-base64';

const APP_WALLET = 'K92n-x2kHiRIBmS0yRGz5ii3OEXFw58__742Qu0DTgA'
const SRC = __ATOMIC_ASSET_SRC__
const STAMP_CONTRACT = __STAMP_CONTRACT__

const lensHtml = lens(identity, assoc('html'))

export default function ({ gql, query, publish, md, getData }) {
  function get(id) {
    return Async.of(id)
      .map(buildFindByIdQuery)
      .chain(Async.fromPromise(gql))
      .chain(edges => {
        const asset = compose(
          head,
          filter(n => find(t => t.name === 'Type', n.tags).value === 'blog-post' && find(t => t.name === 'Uploader', n.tags) === undefined),
          pluck('node')
        )(edges)
        if (asset.tags.find(propEq('Protocol-Name', 'name'))?.value === 'Permapage-Post-v4') {
          return Async.fromPromise(getData)(asset.id)
            .map(
              (a) => ({
                ...toPostItem(asset),
                content: loadContent(a.data), // need to parse html and de-serialize source
                html: a.data
              })
            )
            .chain(post =>
              Async.fromPromise(query)(post.transaction, ['prop', 'balances'])
                .map(assoc('balances', __, post))

            )
        } else {
          return Async.of(asset.tags.find(propEq('Asset-Id', 'name'))?.value)
            .map(id => ({ query: buildSourceQuery(), variables: { ids: [id] } }))
            .chain(Async.fromPromise(gql))
            .map(path(['0', 'node', 'id']))
            .chain(Async.fromPromise(getData))
            .map(a => ({
              ...toPostItem(asset),
              content: a.data
            }))
            .chain(post =>
              Async.fromPromise(query)(post.transaction, ['prop', 'balances'])
                .map(assoc('balances', __, post))

            )

        }

      })
  }

  function preview(post) {
    return generateHtml(md)(post)
  }

  function create(post) {
    return Async.of(post)
      .map(p => p.assetId ? p : assoc('assetId', crypto.randomUUID(), p))
      .map(over(lensHtml, generateHtml(md)))
      .map(over(lensProp('topics'), compose(map(trim), split(','))))
      .map(post => {
        const topicTags = map(v => ({ name: `Topic:${v}`, value: v }), post.topics)
        return {
          asset: {
            data: post.html,
            tags: [
              { name: 'Content-Type', value: 'text/html' },
              { name: 'App-Name', value: 'SmartWeaveContract' },
              { name: 'Title', value: post.title },
              { name: 'Description', value: post.description },
              { name: 'Type', value: 'blog-post' },
              { name: 'Published', value: Date.now() },
              { name: 'Protocol-Name', value: 'Permapage-Post-v4' },
              { name: 'Asset-Id', value: post.assetId },
              { name: 'App-Version', value: '0.3.0' },
              { name: 'Contract-Src', value: SRC },
              {
                name: 'Init-State', value: JSON.stringify({
                  balances: {
                    [post.owner]: 990000,
                    [APP_WALLET]: 1000
                  },
                  name: post.title,
                  ticker: "POST",
                  settings: [['isTradeable', true]],
                  claimable: []
                })
              },
              ...topicTags,
              { name: 'App-Name', value: 'PermaPages' }
            ]
          }
        }
      })
      .chain(Async.fromPromise(publish))
      .map(({ contractTxId }) => assoc('id', contractTxId, post))
  }

  function list(addr) {
    return Async.of(addr)
      .map(buildQuery)
      .chain(Async.fromPromise(gql))
      .map(pluck('node'))
      .map(map(toPostItem))
      .map(uniqBy(prop('assetId')))
    // .chain(nodes =>
    //   Async.fromPromise(query)(STAMP_CONTRACT, ['compose',
    //     ['mapObjIndexed', ['length']],
    //     ['groupBy', ['prop', 'asset']],
    //     // would be nice to filter only the assets from nodes
    //     //['filter', ['flip', ['includes']], pluck('id', nodes)],
    //     ['values'],
    //     ['prop', 'stamps']
    //   ])
    //     .map(counts => map(
    //       n => assoc('stamps', counts[n.id] || 0, n),
    //       nodes
    //     ))
    // )
  }
  return {
    list,
    create,
    get,
    preview
  }
}
//tags: { name: "Asset-Id", values: $ids }
function buildFindByIdQuery(id) {
  return {
    query: `query ($ids: [ID!]!, $cursor: String) {
      transactions(first: 1, after: $cursor, ids: $ids) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            id
            owner {
              address
            }
            tags {
              name
              value
            }
          }
        }
      }
    }`,
    variables: {
      ids: [id]
    }
  }
}

function buildQuery(addr) {
  return {
    query: `query ($owners: [String!], $cursor: String) {
      transactions(first: 100, 
        after: $cursor, 
        owners: $owners, 
        tags: [
          { name: "Type", values: ["blog-post"] }
        ]) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            id
            owner {
              address
            }
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

function toPostItem(node) {
  const getTag = compose(prop('value'), n => find(propEq(n, 'name'), node.tags))
  const published = getTag('Published') ? Number(getTag('Published')) : Date.now()
  const topics = join(', ', pluck('value', filter(t => /^Topic:/.test(t.name), node.tags)))
  const protocol = getTag('Protocol-Name') || 'PermaPages-Post-v0.3'

  return {
    id: node.id,
    type: getTag('Type'),
    title: getTag('Title'),
    description: getTag('Description'),
    protocol: protocol,
    transaction: node.id,
    assetId: getTag('Asset-Id'),
    published,
    stamps: 0,
    owner: node.owner.address,
    topics
  }
}

function generateHtml(md) {
  return (post) => `<!doctype html>
<html data-theme="light">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${post.title}</title>
    <meta name="description" content="${post.description}">
    <meta name="author" content="${post.profile.owner}">
    <meta name="code" content="${post.id}">
    <meta name="about" content="Webpage generated by https://pages.arweave.dev">
    <meta name="source" content="${encode(JSON.stringify(omit(['profile'], post)))}">
    <link href="https://cdn.jsdelivr.net/npm/daisyui@2.15.4/dist/full.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.6.0/styles/github-dark.min.css">
    
    <script src="https://cdn.tailwindcss.com/3.1.3?plugins=typography"></script> 
    <script src="https://unpkg.com/arweave@1.11.4/bundles/web.bundle.min.js"></script>
    <script src="https://unpkg.com/warp-contracts@1.1.3/bundles/web.bundle.min.js"></script>
    
    <!-- custom build of highlight js -->
    <script src="https://arweave.net/_d-GsX52lw7Sdg8hgKKWf_lLohaQ8f4zIYmXxHWMgQc"></script>
    <script src="https://unpkg.com/highlightjs-svelte@1.0.6/dist/svelte.min.js"></script>
    <script type="module">hljs.highlightAll();</script>
    <script defer type="module" src="https://stamp-widget.arweave.dev"></script>
    
  </head>
  <body>
    <main class="min-h-screen flex space-x-8">
      <div class="flex-1">
      <div class="prose md:prose-lg lg:prose-xl m-8 md:mx-auto">
        <h1>${post.title}</h1>
        <p>${post.description}</p>
        
        <div class="flex items-between justify-start">
        <div class="w-1/2 flex flex-col">
          <div class="flex flex-row items-start">
            <img
              class="mask mask-circle h-[48px] w-[48px] m-0 p-0"
              src=${post.profile.avatar}
              alt=${post.profile.name}
            />
            <div class="ml-4 my-0 py-0">
              <h3 class="text-lg font-bold">
                <span>${post.profile.name}</span>
              </h3>
            </div>
          </div>
          <div class="text-xs">Published: ${new Intl.DateTimeFormat('en-US').format(Date.now())}</div>
        </div>
        <div class="flex-none mx-auto flex items-center mt-8">
          <div id="passport"></div>
        </div>
        </div>
        ${md.render(post.content)}
      </div>
      </div>
    </main>
  </body>
</html>
  
  `
}

function loadContent(html) {
  const { document } = parseHTML(html)
  const source = document.head.querySelector('meta[name="source"]').getAttribute('content')
  const post = JSON.parse(decode(source))
  return post.content
}

function buildSourceQuery() {
  return `query ($ids: [String!]!) {
  transactions(first: 1, tags: [
    {name: "Asset-Id", values: $ids },
    {name: "Type", values: ["post-source"]}
  ]) {
    pageInfo {
      hasNextPage
    }
    edges {
      node {
        id
      }
    }
  }
  }`
}