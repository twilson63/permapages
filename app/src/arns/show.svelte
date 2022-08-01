<script>
  import NavBar from "../components/navbar.svelte";
  import { meta } from "tinro";
  import {
    updateSubDomain,
    removeSubDomain,
    getANT,
  } from "../services/registry.js";
  const ANT = "OofLO5E3LLI1OBsvhrda8BPd8RG-CyNlrExGMpUHxBc";
  // GET /arns/:ant
  // show Ticker, Name, Owner, Controller
  // show Records
  // actions, add, update, remove records
</script>

<NavBar />
<main>
  <section class="hero bg-secondary text-secondary-content min-h-[200px]">
    <div class="hero-content flex-col lg:flex-row-reverse w-full">
      <h1 class="text-6xl font-bold flex justify-center items-center space-x-8">
        Arweave Name Token (ANT)
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
  {#await getANT(meta().params.ant) then ant}
    <section class="hero bg-base-200 min-h-[200px]">
      <div class="hero-content flex-col lg:flex-row-reverse w-full">
        <div class="flex flex-col space-y-16 w-full">
          <h2 class="text-3xl">
            {ant.ticker} - (https://{ant.name}.arweave.dev)
          </h2>
        </div>
      </div>
    </section>
    <section class="hero bg-base-100 min-h-[200px]">
      <div class="hero-content flex-col w-full">
        <div class="flex mt-8 w-full">
          <h3 class="flex-1 text-2xl">Records</h3>
          <div class="flex-none">
            <button class="btn btn-primary">Add Record</button>
            <a href="/arns" class="btn btn-secondary">ArNS</a>
          </div>
        </div>

        {#each Object.keys(ant.records) as key}
          <div class="card w-full bg-primary text-primary-content shadow-xl">
            <div class="card-body">
              <h3 class="card-title">
                Record: {key === "@" ? ant.name : key}.arweave.dev
              </h3>
              <p>{`TransactionId: ${ant.records[key]} TTL: 900`}</p>
              <div class="card-actions justify-end">
                <button class="btn">Change</button>
                <button class="btn">Remove</button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/await}
</main>
