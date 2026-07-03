<script>
  import Modal from "../components/modal.svelte";
  export let open;
</script>

<Modal
  bind:open
  bgColor="bg-base-100"
  border="border border-base-300"
  cancel={false}
  ok={false}
  on:cancel={() => (open = false)}
>
  <div class="flex flex-col px-2 py-2 sm:px-6 sm:py-4">
    <p class="eyebrow mb-3">Getting started</p>
    <h2 class="font-display text-2xl font-bold">You'll need a wallet.</h2>
    <p class="mt-3 text-sm leading-relaxed text-base-content/70">
      A wallet is your identity on the permaweb — it signs the pages you
      publish so they are provably yours. No email, no password, no account
      to lose.
    </p>
    <p class="mt-3 text-sm leading-relaxed text-base-content/70">
      Wander is a free browser extension (and mobile app). Install it, create
      a wallet in a minute, and come back — pages under 100KB publish at no
      cost, so you don't need any tokens to start.
    </p>
    <a
      href="https://www.wander.app"
      target="_blank"
      on:click={() => (open = false)}
      class="btn btn-primary btn-block mt-6">Get Wander</a
    >
  </div>

  <button
    on:click={() => (open = false)}
    class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
    aria-label="Close">&#10005;</button
  >
</Modal>
