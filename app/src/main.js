import './tailwind.css'
import App from './App.svelte'
import { address } from './store.js'
import { connectApp } from "./services/arweave.js";

window.addEventListener("arweaveWalletLoaded", async () => {
  if (localStorage.getItem("address") !== "") {
    if (arweaveWallet) {
      try {
        await arweaveWallet.disconnect()
        await arweaveWallet.connect(
          ["ACCESS_ADDRESS", "SIGN_TRANSACTION", "DISPATCH"],
          {
            name: "PermaPages",
            logo: `${window.location.origin}/permapages_logo.svg`,
          }
        );
        const walletConnected = new Event('arweaveWalletConnected')
        setTimeout(() => {
          window.dispatchEvent(walletConnected)
        }, 500)

        address.set(await arweaveWallet.getActiveAddress());

      } catch (e) {
        console.log(e)
      }
    } else {
      address.set("")
    }
  }
});

const app = new App({
  target: document.getElementById('app')
})

export default app

