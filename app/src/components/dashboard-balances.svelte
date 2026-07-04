<script>
  import { address } from "../store.js";
  import { loadBalances } from "../app.js";

  const tiles = [
    { key: "ar", label: "Wallet", unit: "$AR" },
    { key: "stamp", label: "Stamp coin", unit: "$STAMP" },
    { key: "ario", label: "AR.IO network", unit: "$ARIO" },
  ];
</script>

<div class="grid gap-3 sm:grid-cols-3">
  {#await loadBalances($address)}
    {#each tiles as tile}
      <div class="rounded-xl border border-base-300 bg-base-100 p-5">
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">
          {tile.label}
        </p>
        <div class="skeleton-line mt-3 h-7 w-28" aria-hidden="true"></div>
      </div>
    {/each}
  {:then balances}
    {#each tiles as tile}
      <div class="rounded-xl border border-base-300 bg-base-100 p-5">
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">
          {tile.label}
        </p>
        <p class="mt-2 font-display text-2xl font-bold">
          {#if balances[tile.key] === "NA"}
            <span class="text-base-content/40 text-lg">No balance</span>
          {:else}
            {balances[tile.key]}
            <span class="text-sm font-sans font-semibold text-primary">{tile.unit}</span>
          {/if}
        </p>
      </div>
    {/each}
  {/await}
</div>
