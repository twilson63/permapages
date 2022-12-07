const CACHE_URL = 'https://cache.permapages.app'

export const query = (contract, q) =>
  fetch(`${CACHE_URL}/${contract}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(q)
  }).then(res => res.json())
    .then(({ result }) => result)