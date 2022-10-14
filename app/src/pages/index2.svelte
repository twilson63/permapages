<script>
  import NavBar from "../components/navbar.svelte";
  import PagesCards from "../components/pages-cards.svelte";
</script>

<NavBar />

<main class="container mx-auto min-h-screen">
  <div class="w-full">
    <div class="flex flex-row mt-10">
      <div class="w-[48%]">
        <h1 class="txt-gradient text-2xl font-bold">
          You’re all set to create on the Permaweb.
        </h1>
        <h3 class="text-gray-400 text-lg font-semibold">
          Select your next step below.
        </h3>

        <div class="w-4/5 border shadow-sm p-4 rounded-3xl mt-4">
          <p class="text-gray-500">
            You can pay and upload any content to the Permaweb by using wallets
            on the following chains <span class="text-xs"
              >(select to connect)</span
            >.
          </p>

          <div class="flex flex-row items-center gap-2 justify-center mt-2">
            <button>
              <img
                src="eth-logo.png"
                alt="etherium"
                width="40px"
                class="drop-shadow-md"
              />
            </button>
            <button>
              <img
                src="polygon-logo.png"
                alt="polygon"
                width="40px"
                class="drop-shadow-md"
              />
            </button>
            <button>
              <img
                src="sol-logo.png"
                alt="solana"
                width="40px"
                class="drop-shadow-md"
              />
            </button>
            <button>
              <img
                src="tezos-logo.png"
                alt="tezos"
                width="40px"
                class="drop-shadow-md"
              />
            </button>
          </div>
        </div>
      </div>

      <div
        class="w-[52%] border-4 rounded-3xl border-dashed border-gray-200 p-1 flex flex-row items-start"
      >
        <div class="h-full bg-gray-50 rounded-3xl p-4 px-5">
          <h4 class="text-gray-400 text-lg font-semibold mt-4">
            Wallet balance
          </h4>
          <p class="text-black text-xl mt-2 font-semibold tracking-wide">
            $AR 0.<span class="text-[#6F9986]">0017</span>
          </p>

          <div class="w-full flex flex-row gap-2 mt-2">
            <img src="shield-badge.png" alt="shield-badge" width="15px" />
            <span class="text-xs text-gray-400">connected</span>
          </div>

          <button
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
                ><img
                  src="info-icon.png"
                  alt="info-icon"
                  width="18px"
                /></button
              >
            </h4>
            <p class="text-black text-xl mt-2 font-semibold tracking-wide">
              $bAR 67.<span class="text-[#6F9986]">0017</span>
            </p>
          </div>

          <div class="w-full mt-auto">
            <h4
              class="text-gray-400 text-lg font-semibold mt-5 flex flex-row items-center gap-1"
            >
              <span>Stamp Coin</span>
              <button
                ><img
                  src="info-icon.png"
                  alt="info-icon"
                  width="18px"
                /></button
              >
            </h4>
            <p class="text-black text-xl mt-2 font-semibold tracking-wide">
              $sCoin 7.<span class="text-[#6F9986]">0017</span>
            </p>
          </div>
        </div>

        <div class="h-full p-4 px-6">
          <div class="w-full">
            <h4 class="text-gray-400 text-lg font-semibold mt-4">
              AR Name System
            </h4>
            <p class="text-black text-xl mt-2 font-semibold tracking-wide">
              $ArNS <span class="text-gray-400">0.00</span>
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

        <div class="flex flex-row items-center gap-2 mt-8">
          <span class="text-lg font-semibold text-gray-400">...7dl6sK</span>
          <button
            ><img src="drop-down.png" alt="drop-down" width="25px" /></button
          >
        </div>
      </div>
    </div>
  </div>

  <PagesCards />

  <div class="flex flex-row items-center gap-2 w-[220px] mx-auto justify-center my-10 py-2 rounded-full
  bg-gradient-to-r from-[#FF00E5] to-[#7B55EC] drop-shadow-lg hover:from-[#7B55EC] 
  hover:to-[#FF00E5] cursor-pointer">
    <img src="magic-hand.png" alt="magic-hand" width="30px"/>
    <span class="text-white font-semibold">Created on Compose</span>
  </div>
</main>
