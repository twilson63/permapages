<script>
  import DashboardBalances from "./dashboard-balances.svelte";
  import PagesBlockchain from "./pages-blockchain.svelte";
</script>

<div class="w-full min-h-[250px]">
  <div class="flex flex-row mt-10">
    <div class="w-[48%]">
      <slot />
      <PagesBlockchain />
    </div>

    <DashboardBalances />
  </div>
</div>
