<script>
  import NavBar from "../components/navbar.svelte";
</script>

<NavBar />
<main class="min-h-screen bg-base-200">
  <div class="container mx-auto max-w-xl px-4 py-16 text-center">
    <p class="eyebrow mb-3">Domains</p>
    <h1 class="text-3xl font-bold">Names live on the AR.IO network now.</h1>
    <p class="mt-4 leading-relaxed text-base-content/70">
      The ArNS test-token faucet is retired. Lease or permanently buy a name
      with $ARIO on the AR.IO network portal, then come back here to point it
      at any of your pages.
    </p>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <a href="https://arns.arweave.net" target="_blank" class="btn btn-primary px-8"
        >Get a name on arns.arweave.net</a
      >
      <a href="/arns" class="btn btn-ghost rounded-full">Back to your domains</a>
    </div>
  </div>
</main>
