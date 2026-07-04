/**
 * Pure builders for the Arweave tags attached to published pages and posts.
 *
 * Pages and posts are plain signed data items (bundled via the wallet's
 * dispatch → Turbo). Discovery stays GraphQL-tag based, so the Protocol /
 * Title / Type tags here must remain stable for existing queries.
 */

export function buildPageTags(page) {
  const topics = page.topics.map(t => ({
    name: `topic:${t}`,
    value: t
  }))

  return [
    { name: 'Content-Type', value: 'text/html' },
    { name: 'App-Name', value: 'PermaPages' },
    { name: 'App-Version', value: '0.3.0' },
    { name: 'Title', value: page.title },
    { name: 'Description', value: page.description },
    { name: 'Type', value: 'page' },
    { name: 'Protocol', value: page.protocol },
    { name: 'Timestamp', value: new Date().toISOString() },
    { name: 'License', value: page.license }
  ]
    .concat(topics)
    .concat(derivation(page))
    .concat(commercial(page))
    .concat(dataModelTraining(page))
}

export function buildPostTags(post, topicTags) {
  return [
    { name: 'Content-Type', value: 'text/html' },
    { name: 'App-Name', value: 'PermaPages' },
    { name: 'App-Version', value: '0.3.0' },
    { name: 'Title', value: post.title },
    { name: 'Description', value: post.description },
    { name: 'Type', value: 'blog-post' },
    { name: 'Published', value: String(Date.now()) },
    { name: 'Protocol-Name', value: 'Permapage-Post-v4' },
    { name: 'Asset-Id', value: post.assetId },
    ...topicTags
  ]
}

function udlValue(enabled, value, plus) {
  if (!enabled) return null
  if (value === 'Allowed-With-RevenueShare') return `${value}-${plus}%`
  if (value === 'Allowed-With-Fee-One-Time') return `${value}-${plus}`
  if (value === 'Allowed-With-Fee-Monthly') return `${value}-${plus}`
  return value
}

function derivation(page) {
  const value = udlValue(page.derivation, page.derivationValue, page.derivationValuePlus)
  return value ? [{ name: 'Derivation', value }] : []
}

function commercial(page) {
  const value = udlValue(page.commercial, page.commercialValue, page.commercialValuePlus)
  return value ? [{ name: 'Commercial-Use', value }] : []
}

function dataModelTraining(page) {
  const value = udlValue(page.dataModelTraining, page.dataModelTrainingValue, page.dataModelTrainingValuePlus)
  return value ? [{ name: 'Data-Model-Training', value }] : []
}
