/**
 * Loads the EasyMDE editor bundle (a classic script in /public) on demand.
 * The editor is ~378KB — only the compose screens should ever pay for it.
 */
let loaded = null

export function loadEasyMDE() {
  if (window.EasyMDE) return Promise.resolve(window.EasyMDE)
  loaded = loaded || new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'easy-mde.js'
    script.onload = () => resolve(window.EasyMDE)
    script.onerror = reject
    document.head.appendChild(script)
  })
  return loaded
}
