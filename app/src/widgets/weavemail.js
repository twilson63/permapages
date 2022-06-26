export default {
  name: 'weavemail',
  icon: '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" version="1.1" x="0px" y="0px" viewBox="0 0 100 100"><g transform="translate(0,-952.36218)"><path style="text-indent:0;text-transform:none;direction:ltr;block-progression:tb;baseline-shift:baseline;color:#000000;enable-background:accumulate;" d="m 13.09375,974.36217 c -3.3186298,0 -6.0937498,2.68375 -6.0937498,6 l 0,44.00003 c 0,3.3162 2.77512,6 6.0937498,6 l 73.8125,0 c 3.31863,0 6.09375,-2.6838 6.09375,-6 l 0,-44.00003 c 0,-3.31625 -2.77512,-6 -6.09375,-6 l -73.8125,0 z m 1.03125,4 71.75,0 -34.125,30.50003 c -0.85096,0.7605 -2.64904,0.7605 -3.5,0 L 14.125,978.36217 z M 11,980.92467 35.96875,1003.2372 11,1023.9247 11,980.92467 z m 78,0 0,43.00003 L 64.03125,1003.2372 89,980.92467 z m -50,25.03123 6.59375,5.875 c 2.50066,2.2349 6.31184,2.2349 8.8125,0 l 6.59375,-5.875 24.65625,20.4063 -71.3125,0 L 39,1005.9559 z" fill="#000000" fill-opacity="1" stroke="none" marker="none" visibility="visible" display="inline" overflow="visible"></path></g></svg>',
  template,
  script
}

function template() {
  return `
<div class="card">
  <h1 class="text-3xl">Write to me!</h1>
  <form id="weavemailForm">
  <input type="hidden" name="to" value={{address}} />
  <div class="form-control">
    <label class="label" for="subject">Subject</label>
    <input
      class="input input-bordered"
      type="text"
      placeholder="Subject"
      name="subject"
      id="subject"
    />
  </div>
  <div class="form-control">
    <label class="label" for="content">Mail contents</label>
    <textarea
      class="textarea textarea-bordered h-16"
      id="content"
      name="content"
      placeholder="Hello there..."
    ></textarea>
  </div>
  <div class="form-control">
    <label class="label" for="donate"> (Optional) Send me AR</label>
    <input
      class="input input-bordered"
      type="text"
      placeholder="0 AR"
      name="donate"
      id="donate"
    />
  </div>
  <div class="mt-8">
    <button class="btn w-full">Send</button>
  </div>
  </form>
</div>  
  
  `
}

function script() {
  return `
<script>
const arweave = Arweave.init({})
async function sendMail(e) {
  e.preventDefault()
  if (!arweaveWallet) {
    alert('ArConnect is required!')
  }
  const formData = new FormData(e.target)
  const address = formData.get('to')
  var content = formData.get('content')
  const subject = formData.get('subject')
  const mailTagUnixTime = Math.round((new Date()).getTime() / 1000)
  var tokens = formData.get('donate')
  if (tokens == '') {
    tokens = '0'
  }
  tokens = arweave.ar.arToWinston(tokens)
  var pub_key = await get_public_key(address)
  if (pub_key == undefined) {
    alert('Recipient has to send a transaction to the network, first!')
    return
  }

  content = await encrypt_mail(content, subject, pub_key)
  var tx = await arweave.createTransaction(
      {
          target: address,
          data: arweave.utils.concatBuffers([content]),
          quantity: tokens
      }
  )

  tx.addTag('App-Name', 'permamail')
  tx.addTag('App-Version', '0.0.2')
  tx.addTag('Unix-Time', mailTagUnixTime)
  await arweave.transactions.sign(tx, 'use_wallet')
  await arweave.transactions.post(tx)
  alert('Mail dispatched!')

} 

if (arweave) {
  let el = document.getElementById('weavemailForm')
  el.addEventListener('submit', sendMail)
}

async function encrypt_mail (content, subject, pub_key) {
  var content_encoder = new TextEncoder()
  var newFormat = JSON.stringify({ 'subject': subject, 'body': content })
  var mail_buf = content_encoder.encode(newFormat)
  var key_buf = await generate_random_bytes(256)

  // Encrypt data segments
  var encrypted_mail =
  await arweave.crypto.encrypt(mail_buf, key_buf)
  var encrypted_key =
  await window.crypto.subtle.encrypt(
      {
          name: 'RSA-OAEP'
      },
      pub_key,
      key_buf
  )

  // Concatenate and return them
  return arweave.utils.concatBuffers([encrypted_key, encrypted_mail])
}

async function decrypt_mail (enc_data, key) {
  var enc_key = new Uint8Array(enc_data.slice(0, 512))
  var enc_mail = new Uint8Array(enc_data.slice(512))

  var symmetric_key = await window.crypto.subtle.decrypt({ name: 'RSA-OAEP' }, key, enc_key)

  return arweave.crypto.decrypt(enc_mail, symmetric_key)
}

// utils
async function wallet_to_key (wallet) {
  var w = Object.create(wallet)
  w.alg = 'RSA-OAEP-256'
  w.ext = true

  var algo = { name: 'RSA-OAEP', hash: { name: 'SHA-256' } }

  return await crypto.subtle.importKey('jwk', w, algo, false, ['decrypt'])
}


async function get_public_key (address) {
  var txid = await arweave.wallets.getLastTransactionID(address)

  if (txid == '') {
      return undefined
  }

  var tx = await arweave.transactions.get(txid)

  if (tx == undefined) {
      return undefined
  }

  var pub_key = arweave.utils.b64UrlToBuffer(tx.owner)

  var keyData = {
      kty: 'RSA',
      e: 'AQAB',
      n: tx.owner,
      alg: 'RSA-OAEP-256',
      ext: true
  }

  var algo = { name: 'RSA-OAEP', hash: { name: 'SHA-256' } }

  return await crypto.subtle.importKey('jwk', keyData, algo, false, ['encrypt'])
}

async function generate_random_bytes (length) {
  var array = new Uint8Array(length)
  window.crypto.getRandomValues(array)

  return array
}

</script>
  
  `
}
