<script>
  import NavBar from "../components/navbar.svelte";
  import Stat from "../components/stat.svelte";
  import { address } from "../store.js";

  import { getARBalance, getBalance, listANTs } from "../services/registry.js";
</script>

<NavBar />
<main>
  <section class="hero bg-primary text-primary-content min-h-[200px]">
    <div class="hero-content flex-col lg:flex-row-reverse w-full">
      <h1 class="text-6xl font-bold flex justify-center items-center space-x-8">
        Arweave Name System Portal
        <figure class="p-8">
          <img
            src="https://tgbcqufuppegmlhigt2zosiv2q55qty4t4rg2gebmfm4vpvf.arweave.net/mYIoULR7yGYs_6DT1_l0kV1DvYTxyfIm0YgWFZyr6l0"
            alt="arweave logo"
            class="rounded-x1 h-[64px]"
          />
        </figure>
      </h1>
    </div>
  </section>
  <section class="hero bg-base-200 min-h-[200px]">
    <div class="hero-content w-full">
      <div class="stats shadow bg-secondary text-secondary-content">
        {#await getARBalance($address) then value}
          <Stat title="AR" desc="Total AR Balance" {value} />
        {/await}
        {#await getBalance($address)}
          <Stat
            title="ARNS Balance"
            desc="ARNS Test Tokens"
            value="Loading..."
          />
        {:then result}
          <Stat
            title="ARNS Balance"
            desc="ARNS Test Tokens"
            value={result?.balance || 0}
          />
        {:catch error}
          <Stat title="ARNS Balance" desc="ARNS Test Tokens" value="error" />
        {/await}
      </div>
      <div class="flex space-x-4">
        <button class="btn btn-primary">Search</button>
        <button class="btn btn-secondary">Add SubDomain</button>
        <a target="_blank" href="https://ar.io/arns/" class="btn btn-info"
          >Learn More</a
        >
      </div>
    </div>
  </section>
  <section class="hero bg-base-100 min-h-screen">
    <div class="hero-content flex-col items-start justify-start w-full">
      <h3 class="text-2xl font-bold">Your Arweave Name Tokens</h3>
      {#await listANTs($address)}
        Loading...
      {:then ants}
        {#each ants as ant}
          <div class="card w-full bg-base-100 shadow-xl">
            <div class="card-body w-full">
              <h2 class="card-title">{ant.ticker}</h2>
              <div class="flex">
                <p class="flex-1">
                  <a class="link" href="https://{ant.name}.arweave.dev"
                    >https://{ant.name}.arweave.dev</a
                  >
                </p>
                <div class="flex-none flex space-x-2 items-center justify-end">
                  <label class="label">Records:</label>
                  <span>{Object.keys(ant.records).length}</span>
                </div>
              </div>
              <div class="flex">
                <div class="flex-1">
                  Tx: {ant.id}
                  <a
                    class="link flex items-center space-x-2"
                    href="https://v2.viewblock.io/arweave/contract/{ant.id}"
                    target="_blank"
                    ><div>viewblock.io</div>
                    <img class="h-[16px]" src="launch.svg" alt="new tab" /></a
                  >
                </div>
                <div class="flex-none card-actions justify-end">
                  <a class="btn btn-primary" href="/arns/{ant.id}">View</a>
                </div>
              </div>
            </div>
          </div>
        {/each}
      {/await}
    </div>
  </section>
</main>
