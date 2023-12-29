<script>
  import { router } from "tinro";
  import { Jumper } from "svelte-loading-spinners";

  import { connectApp } from "./services/arweave.js";

  import { address } from "./store.js";
  import Navbar from "./components/navbar.svelte";
  import Modal from "./components/modal.svelte";

  let error = null;
  let connecting = false;

  const [_, path] = location.href.split("#");

  async function appConnect() {
    try {
      connecting = true;
      const tId = setTimeout(() => (connecting = false), 2000);
      const walletAddress = await connectApp().catch((e) => "");
      localStorage.setItem("arweave-app", "true");
      address.set(walletAddress);
      clearTimeout(tId);
      connecting = false;
      if (path !== "/connect") {
        router.goto(path);
      } else {
        router.goto("/account");
      }
    } catch (e) {
      connecting = false;
      error = e.message;
    }
  }

  async function fileUpload() {}

  async function arConnect() {
    if (window.arweaveWallet === undefined) {
      window.location.href = "https://arconnect.io";
    }
    try {
      connecting = true;
      await arweaveWallet.connect(
        ["ACCESS_ADDRESS", "SIGN_TRANSACTION", "DISPATCH"],
        {
          name: "PermaPages",
          logo: `${window.location.origin}/permapages_logo.svg`,
        }
      );

      const addr = await arweaveWallet.getActiveAddress();

      address.set(addr);

      connecting = false;

      if (path !== "/connect") {
        router.goto(path);
      } else {
        router.goto("/account");
      }
    } catch (e) {
      connecting = false;
      error = e.message;
    }
  }

  // if (localStorage.getItem("arweave-app") === "true") {
  //   console.log("connecting to arweave.app");
  //   appConnect();
  // }
</script>

<Navbar />
<main>
  <section class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-6xl">Connect Wallet</h1>
        <div class="mt-16 flex space-x-4">
          <div
            class="card bg-base-100 shadow-xl hover:border"
            on:click={arConnect}
          >
            <figure class="px-10 pt-10 bg-gray-400" style="height: 168px;">
              <img
                height="128px"
                src="https://bgwysvp67cg4wxfsvgktephcajni7ggdsa7kgpo5rl637avdlc2a.arweave.net/Ca2JVf74jctcsqmVMjziAlqPmMOQPqM93Yr9v4KjWLQ"
                alt="arconnect logo"
                class="rounded-xl"
              />
            </figure>
            <div class="card-body">
              <h2 class="card-title">ArConnect</h2>
            </div>
          </div>
          <div
            class="card bg-base-100 shadow-xl hover:border"
            on:click={appConnect}
          >
            <figure class="px-10 pt-10 bg-gray-400" style="height: 168px;">
              <img
                src="https://tgbcqufuppegmlhigt2zosiv2q55qty4t4rg2gebmfm4vpvf.arweave.net/mYIoULR7yGYs_6DT1_l0kV1DvYTxyfIm0YgWFZyr6l0"
                alt="arweave logo"
                class="rounded-x1"
              />
            </figure>
            <div class="card-body">
              <h2 class="card-title">ArWeave App</h2>
            </div>
          </div>
        </div>

        <div class="mt-16">
          <p>Need help?</p>
          <p>
            If you are new to ARWeave and don't understand what a wallet is? How
            do I get a wallet? Etc? Click <a class="underline" href="/learn"
              >here</a
            > to learn more about web3 and Arweave
          </p>
        </div>
      </div>
    </div>
  </section>
</main>

<input
  type="checkbox"
  id="error-msg"
  bind:checked={error}
  class="modal-toggle"
/>
<div class="modal">
  <div class="modal-box alert-error text-white">
    <h3 class="font-bold text-lg mb-8">Error Trying to Connect</h3>
    <div class="flex items-center justify-center my-4">
      {error}
    </div>
    <label class="btn float-right" for="error-msg">Close</label>
  </div>
</div>

<Modal open={connecting} ok={false}>
  <h3 class="font-bold md:text-lg mb-8">Connecting to Permapages!</h3>
  <div class="flex items-center justify-center">
    <Jumper size="60" color="rebeccapurple" unit="px" duration="2s" />
  </div>
</Modal>
