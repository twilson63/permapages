<script>
  import DashboardBalances from "./dashboard-balances.svelte";
  import PagesBlockchain from "./pages-blockchain.svelte";
</script>

<div class="w-full">
  <div class="flex flex-row mt-10">
    <div class="w-[48%]">
      <slot />
      <PagesBlockchain />
    </div>

    <DashboardBalances />
  </div>
</div>

<style>
  input[type="radio"]:checked + label {
    position: relative;
  }
  input[type="radio"]:checked + label::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: -10;
    width: 12px;
    height: 5px;
    border-radius: 50%;
    background: linear-gradient(90deg, #ff00e5 0%, #7b55ec 100%);
  }
</style>
