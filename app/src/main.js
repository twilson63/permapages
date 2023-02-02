import './tailwind.css'
import App from './App.svelte'

import { gql, postProfileTx, loadProfile } from "./services/arweave.js";
import { address, account } from "./store.js";
import { profiles } from "./app.js";

window.addEventListener("arweaveWalletLoaded", async () => {
  const profileMgr = profiles({
    gql,
    post: postProfileTx,
    load: loadProfile,
  });

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

        const addr = await arweaveWallet.getActiveAddress()
        address.set(addr);

        const result = await profileMgr.get(addr);
        account.set({ id: addr, profile: result });

      } catch (e) {
        document.querySelector('.arconnect_connect_overlay_extension_temporary').remove()
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

