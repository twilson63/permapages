import { parseHTML } from 'linkedom/worker'
import { trim, pick } from 'ramda'
import { encode, decode } from 'js-base64';

// const Arweave = window.arweave
// const { WarpFactory } = window.warp

// const arweave = Arweave.init({})

export function parse(page) {
  // parse html
  const { document } = parseHTML(page)
  const metaString = decode(document.head.querySelector('meta[name="Meta"]').getAttribute('content'))
  const meta = JSON.parse(metaString)
  // descontruce model
  let result = {
    contentType: 'text/html',
    type: 'page',
    title: document.head.querySelector('title').innerText,
    description: document.head.querySelector('meta[name="description"]').getAttribute('content'),
    topics: document.head.querySelector('meta[name="keywords"]').getAttribute('content').split(',').map(trim),
    content: decode(document.head.querySelector('meta[name="Content"]').getAttribute('content')),
    html: document.body.innerHTML,
    creator: document.head.querySelector('meta[name="Creator"]').getAttribute('content'),
    ...meta

  }
  return result
}

export function htmlify(page, head) {
  const html = createHtml(page, head)
  // const tx = arweave.createTransaction({ data: html })
  // tx.addTag('Content-Type', 'text/html')
  // tx.addTag('App-Name', 'SmartWeaveContract')
  // tx.addTag('App-Version', '0.3.0')
  // tx.addTag('Contract-Src', '')
  // tx.addTag('Protocol-Name', page.protocol)
  // tx.addTag('Type', 'webpage')
  // tx.addTag('Title', page.title)
  // tx.addTag('Description', page.description)
  // //tx.addTag('Topics:')                                                                                                      c')
  // const result = await window.arweaveWallet.dispatch(tx)
  // await WarpFactory.forMainnet().register(tx.id, 'node2')
  return html
}


function createHtml(page) {
  return `<!doctype html>
<html data-theme="${page.theme}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${page.title}</title>
    <meta name="description" content="${page.description}">
    <meta name="keywords" content="${page.topics.join(', ')}">
    <meta name="Protocol-Name" content="${page.protocol}">
    <meta name="Content" content="${encode(page.content)}">
    <meta name="Timestamp" content="${page.timestamp}">
    <meta name="Creator" content="${page.creator}">
    <meta name="Meta" content="${encode(JSON.stringify(pick(['profile', 'weavemail', 'ethwallet', 'theme', 'includeFooter', 'allowStamps', 'noContract', 'noBundlr', 'widgets', 'derivation', 'derivationValue', 'derivationValuePlus', 'commercial', 'commercialValue', 'commercialValuePlus', 'dataModelTraining', 'dataModelTrainingValue', 'dataModelTrainingValuePlus'], page)))}">
    <meta name="about" content="Webpage generated by https://pages.arweave.dev">
    <link href="https://cdn.jsdelivr.net/npm/daisyui@2.15.4/dist/full.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.6.0/styles/github-dark.min.css">
    
    <script src="https://cdn.tailwindcss.com/3.1.3?plugins=typography"></script>
    
    <script src="https://unpkg.com/arweave@1.11.4/bundles/web.bundle.min.js"></script>

    <!-- custom build of highlight js -->
    <script src="https://arweave.net/_d-GsX52lw7Sdg8hgKKWf_lLohaQ8f4zIYmXxHWMgQc"></script>
    <script src="https://unpkg.com/highlightjs-svelte@1.0.6/dist/svelte.min.js"></script>
    <script type="module">hljs.highlightAll();</script>
    ${page.widgets.reduce((a, w) => a + `<script defer type="module" src="${w.source}"></script>`, '')}
  </head>
  <body>
    ${page.html}
    ${page.includeFooter ? `
    <footer class="footer p-10 bg-base-300 text-base-content">
      <div>
        <span class="footer-title">About</span> 
        <p>Built using <a href="https://permapages.app" target="_blank">Permapages</p>
        <a class="link link-hover" href="https://permanotes.app/#/notes/WYfC1LPyHJlHrTaN11QS_9-rDMXW0EREqp3FlYKzIWE">Documentation</a>
      </div> 
      <div>
        <span class="footer-title">Connect</span> 
        <a target="_blank" href="https://twitter.com/permapages" class="link link-hover">Twitter</a> 
        <a target="_blank" href="https://github.com/twilson63/permapages"class="link link-hover">Github</a> 
      </div> 
      <div>
        <span class="footer-title text-2xl">🚀</span> 
        <div class="flex flex-col">
          <a href="https://permapages.app" class="btn rounded-2xl font-bold bg-black text-white">👉 Create your own Permapage here 🚀</a>
          <br />
          <p class="text-accent">Lets get started!</p>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <img class="h-[128px] w-[128px]" src="https://permapages.app/permapages_logo.svg" alt="logo" />
        <img class="" src="https://permapages.app/ar-dark.png" alt="logo" />
      </div>
    </footer>
    ` : ''}
    
  </body>
</html>
  `
}