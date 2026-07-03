<script>
  import { createEventDispatcher } from "svelte";
  import Modal from "../components/modal.svelte";
  import { router } from "tinro";

  import { postProfileTx, loadProfile } from "../services/arweave.js";
  import { gql } from "../services/gql.js";
  import { address, account } from "../store.js";
  import { profiles } from "../app.js";

  export let open;
  const dispatch = createEventDispatcher();

  let connecting = false;
  let error = null;

  const profileMgr = profiles({
    gql,
    post: postProfileTx,
    load: loadProfile,
  });

  const permissions = [
    {
      grant: "See your address",
      why: "Your public wallet address identifies your pages. Nothing private is shared.",
    },
    {
      grant: "Ask you to sign",
      why: "Every page you publish is signed by you. The wallet asks before each signature.",
    },
    {
      grant: "Deliver your pages",
      why: "Signed pages are handed to Arweave for permanent storage — free under 100KB.",
    },
  ];

  async function connect() {
    if (!window.arweaveWallet) {
      window.open("https://www.wander.app");
      return;
    }
    try {
      connecting = true;
      error = null;
      await arweaveWallet.disconnect();
      await arweaveWallet.connect(
        ["ACCESS_ADDRESS", "SIGN_TRANSACTION", "DISPATCH"],
        { name: "PermaPages", logo: window.location.origin + "/permapages.svg" },
      );
      const addr = await arweaveWallet.getActiveAddress();
      $address = addr;

      const result = await profileMgr.get($address);
      $account = { id: $address, profile: result };

      connecting = false;
      open = false;
      router.goto("/dashboard");
    } catch (e) {
      connecting = false;
      error = "The wallet closed before connecting. No permissions were granted — try again when ready.";
      document
        .querySelector(".arconnect_connect_overlay_extension_temporary")
        ?.remove();
    }
  }
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
    <p class="eyebrow mb-3">Connect a wallet</p>
    <h2 class="font-display text-2xl font-bold">
      Your wallet is your byline.
    </h2>
    <p class="mt-2 text-sm text-base-content/70">
      PermaPages asks Wander for exactly three permissions:
    </p>

    <ul class="mt-5 space-y-4">
      {#each permissions as p}
        <li class="flex gap-3">
          <span class="mt-1 text-[0.55rem] text-primary" aria-hidden="true">&#9670;</span>
          <div>
            <p class="text-sm font-semibold">{p.grant}</p>
            <p class="text-sm text-base-content/65">{p.why}</p>
          </div>
        </li>
      {/each}
    </ul>

    {#if error}
      <div class="alert alert-warning mt-5 text-sm">{error}</div>
    {/if}

    <button
      class="btn btn-primary btn-block mt-6"
      class:loading={connecting}
      disabled={connecting}
      on:click={connect}
    >
      {connecting ? "Waiting for Wander…" : "Connect with Wander"}
    </button>

    <button
      on:click={() => {
        dispatch("help");
        open = false;
      }}
      class="mt-3 text-center text-sm text-base-content/60 underline underline-offset-4 hover:text-base-content"
      >I don't have a wallet</button
    >
  </div>
  <button
    on:click={() => (open = false)}
    class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
    aria-label="Close">&#10005;</button
  >
</Modal>
