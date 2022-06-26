export const handle = () => Promise.resolve({ profile: { name: 'rakis' } })
export const account = () => Promise.resolve({ profile: {} })
export const load = () => Promise.resolve({
  id: '1',
  public: true,
  likeContract: '1'
})

export const likes = {
  likes() { return Promise.resolve('2') },
  create() { return Promise.resolve('contract-id') }
}

export const note = {
  id: '1',
  owner: '1',
  title: 'New Note',
  description: 'Description',
  content: 'Content',
  slug: 'new-note',
  public: true,
  timestamp: (new Date()).toISOString()
}

export const postWebpage = (n) => {
  console.log(n)
  return Promise.resolve({ id: 1 })
}

export const post = (n) => Promise.resolve(n)
export const waitfor = () => Promise.resolve(true)
export const gql = () => Promise.resolve({
  data: {
    data: {
      transactions: {
        edges: [
          {
            node: {
              id: '1',
              owner: {
                address: 'owner-address-1'
              },
              tags: [
                { name: 'Type', value: 'note' },
                { name: 'Note-Topic', value: '' },
                { name: 'Note-Rev', value: '1' },
                { name: 'Note-Public', value: 'true' },
                { name: 'Note-Slug', value: 'title' },
                {
                  name: 'Note-Title',
                  value: 'Title'
                }, {
                  name: 'Description',
                  value: 'Description'
                }, {
                  name: 'Content-Type',
                  value: 'application/json'
                }, {
                  name: 'Timestamp',
                  value: '2022-05-19T00:00:00'
                }]
            }
          }
        ]
      }
    }
  }
})