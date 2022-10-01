<script>
  import { createEventDispatcher } from "svelte";
  import Modal from "../components/modal.svelte";
  import { ArweaveWebWallet } from "arweave-wallet-connector";

  import { account } from "../store.js";

  export let open;
  const dispatch = createEventDispatcher();

  async function arconnect() {
    if (!window.arweaveWallet) {
      window.open("https://arconnect.io");
    }
    try {
      await arweaveWallet.disconnect();
      await arweaveWallet.connect(
        ["ACCESS_ADDRESS", "SIGN_TRANSACTION", "DISPATCH"],
        { name: "img" }
      );
      const addr = await arweaveWallet.getActiveAddress();
      $account = { addr };
      open = false;
      dispatch("connected");
    } catch (e) {
      console.log(e);
    }
  }

  async function arwallet() {
    try {
      const wallet = new ArweaveWebWallet({
        name: "img",
      });
      wallet.setUrl("arweave.app");
      await wallet.connect();

      const addr = await arweaveWallet.getActiveAddress();
      $account = { addr };
      open = false;
      dispatch("connected");
    } catch (e) {
      console.log(e);
    }
  }
</script>

<Modal
  bind:open
  bgColor="bg-white"
  border="border-4 border-[#929292]"
  cancel={true}
  on:cancel={() => (open = false)}
>
  <div class="px-[36px] py-[24px] flex flex-col space-y-8">
    <img class="h-[55px] w-[55px]" src="assets/wallet.svg" alt="wallet" />
    <h2 class="text-2xl font-bold text-[#160042]">
      Arweave wallet needed to post
    </h2>
    <p class="text-xl  text-[#160042]">Select your preferred wallet below:</p>
    <button
      class="btn btn-block rounded-full hover:bg-gray-400"
      on:click={arconnect}>ArConnect</button
    >
    <button
      on:click={arwallet}
      class="btn btn-block rounded-full bg-[#E4E6F1] text-black hover:bg-gray-400"
      >Arweave.app</button
    >
    <button
      on:click={() => {
        dispatch("help");
        open = false;
      }}
      class="link no-underline text-center  text-[#160042]"
      >I don't have a wallet</button
    >
  </div>
</Modal>
