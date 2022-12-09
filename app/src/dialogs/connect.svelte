<script>
  import { createEventDispatcher } from "svelte";
  import Modal from "../components/modal.svelte";
  import { ArweaveWebWallet } from "arweave-wallet-connector";
  import { router } from "tinro";

  import { gql, postProfileTx, loadProfile } from "../services/arweave.js";
  import { address, account } from "../store.js";
  import { profiles } from "../app.js";

  export let open;
  const dispatch = createEventDispatcher();

  const profileMgr = profiles({
    gql,
    post: postProfileTx,
    load: loadProfile,
  });

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
      $address = addr;

      const result = await profileMgr.get($address);
      $account = { id: $address, profile: result };

      open = false;
      router.goto("/dashboard");
    } catch (e) {
      console.log(e);
    }
  }

  async function arwallet() {
    try {
      const wallet = new ArweaveWebWallet({
        name: "pages",
        logo: `${window.location.origin}/permapages_logo.svg`,
      });
      wallet.setUrl("arweave.app");
      await wallet.connect();

      const addr = await arweaveWallet.getActiveAddress();
      $address = addr;

      const result = await profileMgr.get($address);
      $account = { id: $address, profile: result };
      console.log($account);

      open = false;
      router.goto("/dashboard");
    } catch (e) {
      console.log(e);
    }
  }
</script>

<Modal
  bind:open
  bgColor="bg-white"
  border="border-4 border-[#929292]"
  cancel={false}
  ok={false}
  on:cancel={() => (open = false)}
>
  <div class="px-[36px] py-[24px] flex flex-col space-y-8">
    <img class="h-[55px] w-[55px]" src="wallet-icon.png" alt="wallet" />
    <h2 class="text-2xl font-bold text-[#160042]">
      Arweave wallet needed to post
    </h2>
    <p class="text-xl  text-[#160042]">Select your preferred wallet below:</p>
    <button
      class="btn btn-block rounded-full hover:bg-gray-400 bg-black normal-case"
      on:click={arconnect}>ArConnect</button
    >
    <button
      on:click={arwallet}
      class="btn btn-block rounded-full bg-[#E4E6F1] text-black hover:bg-gray-400 normal-case"
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
  <button
    on:click={() => (open = false)}
    class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
  >
</Modal>
