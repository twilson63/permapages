<script>
  import Modal from "../components/modal.svelte";
  export let open;
</script>

<Modal
  bind:open
  bgColor="bg-white"
  border="border-4 border-[#929292]"
  cancel={false}
  ok={false}
  on:cancel={() => (open = false)}
>
  <div class="px-[36px] py-[16px] flex flex-col space-y-8">
    <img class="h-[55px] w-[55px]" src="wallet-icon.png" alt="wallet" />
    <h2 class="text-2xl font-bold text-[#160042]">
      Arweave wallet needed to post
    </h2>
    <p class="text-lg  text-[#160042]">
      You'll need what's called a `wallet` to interact with this app. Tap one of
      the buttons on this page and add the ArConnect browser extension OR use
      Arweave.app.
    </p>
    <p class="text-lg text-[#160042] mt-0">
      $AR tokens are needed as well. Go to <a
        href="https://faucet.arweave.net"
        target="_blank"
        class="underline hover:no-underline">faucet.arweave.net</a
      > to get free tokens to post.
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

  <button
    on:click={() => (open = false)}
    class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
  >
</Modal>
