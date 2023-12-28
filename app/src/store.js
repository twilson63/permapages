import { writable } from 'svelte/store'

let _addr = null
export const address = writable('')
address.subscribe((addr = '') => {
  _addr = addr
  if (addr.length > 0) {
    localStorage.setItem('address', addr)
  }
  return true
})

export const account = writable({})

export const topics = writable([])

export const cache = writable([])
//cache.subscribe(data => localStorage.setItem('notes', JSON.stringify(data)))

//export const webpages = writable(JSON.parse(localStorage.getItem('webpages') || '[]') || [])
//webpages.subscribe(data => localStorage.setItem('webpages', JSON.stringify(data)))
export const pageCache = writable([])

export const postCache = writable([])

export const arnsCache = writable(JSON.parse(localStorage.getItem(`arnsCache-${_addr}`) || '[]'))
arnsCache.subscribe(v => {
  if (_addr) {
    localStorage.setItem(`arnsCache-${_addr}`, JSON.stringify(v))
  }
})

export const balances = writable({})