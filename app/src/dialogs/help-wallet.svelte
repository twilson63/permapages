<script>
  import Modal from "../components/modal.svelte";
  export let open;
</script>

<Modal
  bind:open
  bgColor="bg-white"
  border="border-4 border-[#929292]"
  cancel={true}
  on:cancel={() => (open = false)}
>
  <div class="px-[36px] py-[16px] flex flex-col space-y-8">
    <img class="h-[55px] w-[55px]" src="assets/wallet.svg" alt="wallet" />
    <h2 class="text-2xl font-bold text-[#160042]">
      Arweave wallet needed to post
    </h2>
    <p class="text-xl  text-[#160042]">
      You'll need what's called a `wallet` to interact with this app. Tap one of
      the buttons on this page and add the ArConnect browser extension OR use
      Arweave.app.
    </p>
    <a
      href="https://arconnect.io"
      target="_blank"
      on:click={() => (open = false)}
      class="btn btn-block rounded-full bg-[#4635D5] text-white"
      >Get ArConnect extension</a
    >
    <a
      href="https://arweave.app"
      target="_blank"
      on:click={() => (open = false)}
      class="btn btn-block rounded-full bg-[#E4E6F1] text-black hover:bg-gray-400"
      >Create wallet via Arweave.app</a
    >
  </div>
</Modal>
