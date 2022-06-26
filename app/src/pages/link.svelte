<script>
  import NavBar from "../components/navbar.svelte";
  import { register } from "../services/registry.js";
  import { pages } from "../app.js";
  import Modal from "../components/modal.svelte";
  import { Jumper } from "svelte-loading-spinners";
  import { router } from "tinro";
  import { address } from "../store.js";

  let processing = false;
  let errorDialog = false;
  let errorMessage = "";
  let successDialog = false;

  const { purchase } = pages({ register });
  async function doPurchase() {
    try {
      processing = true;
      link.owner = $address;
      const result = await purchase(link);
      processing = false;
      if (result.ok) {
        successDialog = true;
      } else {
        errorMessage = result.message;
        link = {};
        errorDialog = true;
      }
    } catch (e) {
      processing = false;
      errorMessage = "Something went wrong with your request!";
      errorDialog = true;
    }
  }

  let link = {};
</script>

<NavBar />
<main>
  <section class="hero bg-base-200 min-h-screen items-start">
    <div class="hero-content flex-col lg:flex-row-reverse w-full">
      <div class="text-center lg:text-left">
        <!--
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-title">Price</div>
          <div class="stat-value">2 ArNS</div>
        </div>
      </div>
      -->
        <h1 class="text-5xl font-bold">Create Permalink</h1>
        <p class="py-6">
          Create ArNS Permalink for your profile page or application
        </p>
        <blockquote>https://[your-name].arweave.net</blockquote>
        <div class="my-16 alert alert-warning">
          By purchasing a permalink, it will cost ArNS Tokens.
        </div>
        <p class="mt-8">
          If you are looking to create a permapage? (Click "New Permapage") <a
            class="link"
            href="/pages/new">New Permapage</a
          >
        </p>
      </div>
      <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <div class="card-body">
          <form on:submit|preventDefault={doPurchase}>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Sub domain</span>
              </label>
              <input
                required
                type="text"
                placeholder="sub-domain"
                class="input input-bordered"
                bind:value={link.name}
              />
              <small>https://[subdomain].arweave.net</small>
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Transaction Id</span>
              </label>
              <input
                required
                type="text"
                placeholder="arweave transaction"
                class="input input-bordered"
                bind:value={link.transactionId}
              />
              <small>Transaction Id to link</small>
            </div>
            <div class="form-control mt-6">
              <button class="btn btn-primary">Purchase</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</main>

<Modal id="processing" open={processing} ok={false}>
  <h3 class="font-bold text-lg">Purchasing Link</h3>
  <div class="flex items-center justify-center">
    <Jumper size="60" color="rebeccapurple" unit="px" duration="2s" />
  </div>
</Modal>
<Modal id="errorDialog" open={errorDialog}>
  <h3 class="font-bold text-lg text-error">Error with Request</h3>
  <p class="py-8">{errorMessage}</p>
</Modal>
<Modal
  id="successDialog"
  open={successDialog}
  on:click={() => {
    window.scrollTo(0, 0);
    router.goto("/pages");
  }}
>
  <h3 class="font-bold text-lg text-success">Success!</h3>
  <p class="py-8">
    Successfully registered ArNS Subdomain, it will take a few minutes to mint
    domain.
  </p>
</Modal>
