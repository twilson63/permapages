import { writable } from 'svelte/store'

export const address = writable('')
address.subscribe((addr = '') => addr.length > 0 ? localStorage.setItem('address', addr) : '')

export const account = writable({})

export const topics = writable([])

export const cache = writable([])
//cache.subscribe(data => localStorage.setItem('notes', JSON.stringify(data)))

//export const webpages = writable(JSON.parse(localStorage.getItem('webpages') || '[]') || [])
//webpages.subscribe(data => localStorage.setItem('webpages', JSON.stringify(data)))
export const pageCache = writable([])