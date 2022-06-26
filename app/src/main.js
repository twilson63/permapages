import './tailwind.css'
import App from './App.svelte'
// import { arweave } from './services/arweave.js'

// window.arweave = arweave

const app = new App({
  target: document.getElementById('app')
})

export default app

