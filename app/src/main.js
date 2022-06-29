import './tailwind.css'
import App from './App.svelte'
import { address } from './store.js'

window.addEventListener("arweaveWalletLoaded", async () => {
  if (localStorage.getItem("address") !== "") {
    if (arweaveWallet) {
      try {
        await arweaveWallet.connect(
          ["ACCESS_ADDRESS", "SIGN_TRANSACTION", "DISPATCH"],
          {
            name: "PermaPages",
            logo: `${window.location.origin}/permapages_logo.svg`,
          }
        );

        address.set(await arweaveWallet.getActiveAddress());

      } catch (e) {
        console.log(e)
      }
    } else {
      address.set("");
    }
  }
});


const app = new App({
  target: document.getElementById('app')
})

export default app

