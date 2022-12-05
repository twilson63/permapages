<script>
  import { address } from "../store.js";
  import { takeLast } from "ramda";
  import { loadBalances } from "../app.js";

  function showBalance(balance) {
    if (balance === "NA") {
      return "No Balance";
    }
    const b = balance.split(".");
    return `${b[0]}.<span class="text-[#6F9986]"
          >${b[1]}</span
        >`;
  }
</script>

{#await loadBalances($address) then balances}
  <div
    class="w-[52%] border-4 rounded-3xl border-dashed border-gray-100 p-1 flex flex-row items-start justify-between"
  >
    <div class="h-full bg-gray-50 rounded-3xl p-4 px-5 mr-auto">
      <h4 class="text-gray-400 text-lg font-semibold mt-4">Wallet balance</h4>
      <p class="text-black text-xl mt-2 font-semibold tracking-wide">
        $AR {@html showBalance(balances.ar)}
      </p>

      <div class="w-full flex flex-row gap-2 mt-2">
        <img src="shield-badge.svg" alt="shield-badge" width="15px" />
        <span class="text-xs text-gray-400 leading-5">connected</span>
      </div>

      <button
        disabled
        class="px-6 py-2 bg-gray-200 text-black rounded-full mt-4 font-semibold drop-shadow-sm hover:bg-gray-300"
        >Buy $AR</button
      >
    </div>

    <div class="h-full p-4 px-6">
      <div class="w-full">
        <h4
          class="text-gray-400 text-lg font-semibold mt-4 flex flex-row items-center gap-1"
        >
          <span>Burned AR</span>
          <button
            ><img src="info-icon.png" alt="info-icon" width="18px" /></button
          >
        </h4>
        <p class="text-black text-xl mt-2 font-semibold tracking-wide">
          $bAR {@html showBalance(balances.bar)}
        </p>
      </div>

      <div class="w-full mt-auto">
        <h4
          class="text-gray-400 text-lg font-semibold mt-5 flex flex-row items-center gap-1"
        >
          <span>Stamp Coin</span>
          <button
            ><img src="info-icon.png" alt="info-icon" width="18px" /></button
          >
        </h4>
        <p class="text-black text-xl mt-2 font-semibold tracking-wide">
          $STAMP {@html showBalance(balances.stamp)}
        </p>
      </div>
    </div>

    <div class="h-full p-4 px-6">
      <div class="w-full">
        <h4 class="text-gray-400 text-lg font-semibold mt-4">AR Name System</h4>
        <p class="text-black text-xl mt-2 font-semibold tracking-wide">
          $ArNS {balances.arns}
        </p>
      </div>

      <div class="w-full mt-auto flex flex-col items-center justify-center">
        <button
          class="px-5 py-2 bg-gray-100 text-black rounded-full mt-4 font-semibold drop-shadow-sm
               hover:bg-gray-200">Get ArNS tokens</button
        >

        <a href="/#/#" class="text-gray-400 mt-1">What is ArNS?</a>
      </div>
    </div>

    <div class="flex flex-row items-center gap-2 mt-8 ml-auto">
      <span class="text-lg font-semibold text-gray-400"
        >...{takeLast(6, $address)}</span
      >
      <!--
    <button><img src="arrow-down.svg" alt="drop-down" width="25px" /></button>
    -->
    </div>
  </div>
{/await}
