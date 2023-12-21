const CACHE_URL = 'https://dre-u.warp.cc'

export const query = (contract, q) =>
  fetch(`${CACHE_URL}/contract/?id=${contract}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(q)
  }).then(res => res.json())
    .then(({ result }) => result)