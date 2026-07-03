import { test, assert } from 'vitest'
import { buildPageTags, buildPostTags } from './tags.js'

const page = {
  title: 'My Page',
  description: 'A page',
  protocol: 'PermaPages-v0.5',
  license: 'IVjAM1C3x3GFdc3t9EqMnbtGnpgTuJbaiYZa1lk09_8',
  topics: ['dev', 'arweave'],
  derivation: true,
  derivationValue: 'Allowed-With-RevenueShare',
  derivationValuePlus: '10',
  commercial: true,
  commercialValue: 'Allowed',
  dataModelTraining: false
}

const tagValue = (tags, name) => tags.find(t => t.name === name)?.value
const tagCount = (tags, name) => tags.filter(t => t.name === name).length

test('page tags carry discovery + UDL tags and no contract tags', () => {
  const tags = buildPageTags(page)

  assert.equal(tagValue(tags, 'Content-Type'), 'text/html')
  assert.equal(tagValue(tags, 'Protocol'), 'PermaPages-v0.5')
  assert.equal(tagValue(tags, 'Type'), 'page')
  assert.equal(tagValue(tags, 'Title'), 'My Page')
  assert.equal(tagValue(tags, 'App-Name'), 'PermaPages')
  assert.equal(tagValue(tags, 'License'), 'IVjAM1C3x3GFdc3t9EqMnbtGnpgTuJbaiYZa1lk09_8')

  // topics preserved for discovery
  assert.equal(tagValue(tags, 'topic:dev'), 'dev')
  assert.equal(tagValue(tags, 'topic:arweave'), 'arweave')

  // UDL
  assert.equal(tagValue(tags, 'Derivation'), 'Allowed-With-RevenueShare-10%')
  assert.equal(tagValue(tags, 'Commercial-Use'), 'Allowed')
  assert.equal(tagValue(tags, 'Data-Model-Training'), undefined)

  // no SmartWeave/atomic-asset contract tags on plain data items
  assert.equal(tagValue(tags, 'Contract-Src'), undefined)
  assert.equal(tagValue(tags, 'Init-State'), undefined)
  assert.equal(tagCount(tags, 'App-Name'), 1)
})

test('post tags keep the Permapage-Post-v4 discovery shape without contract tags', () => {
  const tags = buildPostTags(
    { title: 'Post', description: 'D', assetId: 'abc-123' },
    [{ name: 'Topic:dev', value: 'dev' }]
  )

  assert.equal(tagValue(tags, 'Protocol-Name'), 'Permapage-Post-v4')
  assert.equal(tagValue(tags, 'Type'), 'blog-post')
  assert.equal(tagValue(tags, 'Asset-Id'), 'abc-123')
  assert.equal(tagValue(tags, 'Topic:dev'), 'dev')
  assert.ok(Number(tagValue(tags, 'Published')) > 0)

  assert.equal(tagValue(tags, 'Contract-Src'), undefined)
  assert.equal(tagValue(tags, 'Init-State'), undefined)
  assert.equal(tagCount(tags, 'App-Name'), 1)
})
