<script>
  import { onDestroy } from "svelte";
  import { router } from "tinro";
  import NavBar from "../components/navbar.svelte";
  import Modal from "../components/modal.svelte";
  import { address, arnsCache } from "../store.js";
  import SubdomainTable from "../components/subdomains.svelte";
  import find from "ramda/src/find";
  import propEq from "ramda/src/propEq";
  import { Jumper } from "svelte-loading-spinners";

  import {
    search,
    listANTs,
    register,
    updateSubDomain,
    getBalance,
    getARBalance,
    getFees,
  } from "../services/registry.js";
  import { pages } from "../app.js";
  import { gql } from "../services/arweave.js";

  let changeDialog = false;
  let changeData = {};

  let transferDialog = false;
  let removeDialog = false;
  let searchDialog = false;
  let searchMessage = "";
  let searchText = "";
  let connectDialog = false;
  let registerDialog = false;
  let registerData = { subdomain: "" };
  let successDialog = false;
  let successData = {};
  let errorDialog = false;
  let errorMessage = "";
  let registering = false;
  let claimingTokens = localStorage.getItem($address + "-claim") || "Available";
  let timeout = null;
  let timeout2 = null;

  $: balance = "Checking...";
  let ar = "Checking...";
  let fees = [0, 0];
  $: {
    getFees(registerData.subdomain).then((x) => (fees = x));
  }

  onDestroy(() => {
    clearTimeout(timeout);
    clearTimeout(timeout2);
  });

  async function doSearch() {
    const result = await search(searchText);
    if (result.ok) {
      searchMessage = "No registration found. You may register this subdomain";
      searchDialog = true;
    } else {
      searchText = "";
      searchMessage = "This subdomain is already registered";
      searchDialog = true;
    }
  }

  async function registerDomain() {
    if ($address) {
      registerDialog = true;
      // load pages
      // show dialog
    } else {
      // show message dialog
      connectDialog = true;
    }
  }
  async function submitRegistration() {
    registerDialog = false;
    registering = true;
    const result = await pages({ register }).purchase({
      name: registerData.subdomain,
      owner: $address,
      transactionId: registerData.transactionId,
    });
    registering = false;
    if (result.ok) {
      $arnsCache = [
        {
          id: result.id,
          name: registerData.subdomain,
          subdomain: registerData.subdomain,
          records: { "@": registerData.transactionId },
        },
        ...$arnsCache,
      ];
      list = doListANTS($address);
      successData.message = `You have successfully registered your subdomain ${registerData.subdomain}`;
      successDialog = true;
    } else {
      errorMessage = result.message;
      errorDialog = true;
    }
  }

  function showChangeDialog(e) {
    console.log(e.detail.id);
    changeData = { ANT: e.detail.id };
    changeDialog = true;
  }

  async function handleChange(e) {
    const result = await updateSubDomain(
      changeData.ANT,
      changeData.transactionId
    );
    if (result.ok) {
      successData = {
        message: "Successfully changed transaction id",
      };
      successDialog = true;
    } else {
      errorMessage = result.message;
      errorDialog = true;
    }
    changeData = {};
    changeDialog = false;
  }

  async function listPermapages() {
    const ps = await pages({ gql }).list($address);

    return ps.reduce(
      (acc, v) => (find(propEq("title", v.title), acc) ? acc : [...acc, v]),
      []
    );
  }

  async function doGetBalance() {
    try {
      const [arns, _ar] = await Promise.all([
        getBalance($address),
        getARBalance($address),
      ]);
      balance = arns.balance;
      ar = _ar;
    } catch (e) {
      console.log(e);
      if (
        ![
          "result is null",
          "Cannot read properties of null (reading 'balance')",
        ].includes(e.message)
      ) {
        errorMessage =
          "An error occurred trying to check you ArNS Test token balance.";
        errorDialog = true;
      } else {
        balance = "Not Found";
        ar = "Not Found";
      }
    }
  }

  if ($address) {
    setTimeout(doGetBalance, 100);
  }

  async function doListANTS($address) {
    const results = await listANTs($address);
    const pending = ($arnsCache || []).filter((n) =>
      find(propEq("name", n.name), results) ? false : true
    );

    return [...pending, ...results].reduce(
      (acc, v) => (find(propEq("id", v.id), acc) ? acc : [...acc, v]),
      []
    );
  }

  function watchClaim() {
    function doFetch() {
      return fetch(`https://arns-faucet.deno.dev?address=${$address}`)
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            return { processed: false, alreadyClaimed: false, approved: false };
          }
        })
        .then((doc) => {
          console.log(doc);
          if (doc.alreadyClaimed) {
            claimingTokens = "Already Claimed";
            localStorage.setItem($address + "-claim", claimingTokens);
            return;
          }

          if (!doc.processed) {
            claimingTokens = "Processing";
            localStorage.setItem($address + "-claim", claimingTokens);
            return;
          }
          if (!doc.approved) {
            claimingTokens = "Not Approved";
            localStorage.setItem($address + "-claim", claimingTokens);
            return;
          }
          if (doc.processed && doc.approved) {
            claimingTokens = "Claimed";
            localStorage.setItem($address + "-claim", claimingTokens);
            return;
          }
        });
    }
    timeout2 = setTimeout(watchClaim, 2 * 60 * 1000);
    doFetch();
    console.log("checking status " + new Date().toISOString());
  }

  function checkDomains() {
    timeout = setTimeout(() => {
      console.log("checking domains");
      list = doListANTS($address);
      checkDomains();
    }, 1000 * 60 * 4);
  }

  checkDomains();

  let list = doListANTS($address);
  if (claimingTokens !== "Available") {
    watchClaim();
  }
</script>

<NavBar />
<main>
  <section class="hero bg-base-200 min-h-screen items-start">
    <div class="hero-content flex-col lg:flex-row-reverse w-full">
      <div class="flex flex-col space-y-16 w-full">
        <div>
          <div class="flex items-center">
            <div class="flex-1 flex items-center space-x-8">
              <h2 class="text-2xl mb-2">ArNS Registry Portal</h2>
              <a class="link" href="https://ar.io/arns">More Information</a>
              {#if $address}
                <div>ArNS Balance: {balance}</div>
                <div>$AR Balance: {ar}</div>
              {/if}
              <blockquote class="text-sm p-4">
                In order to register a subdomain, you need a small amount of $AR
                in your wallet and enough $ARNS TEST Tokens
              </blockquote>
            </div>
            <div class="flex-none">
              <button
                disabled={balance === 0 || ar === 0}
                on:click={registerDomain}
                class="btn btn-secondary">Register</button
              >
              {#if claimingTokens === "Available"}
                <a
                  class="btn btn-primary"
                  target="_blank"
                  href="https://twitter.com/intent/tweet?text={encodeURI(
                    'I am requesting Arweave Name System tokens to register my permaweb domain! My address is ' +
                      $address +
                      '🐘'
                  )}"
                  on:click={() => {
                    localStorage.setItem($address + "-claim", "Processing");
                    claimingTokens = "Processing";
                    watchClaim();
                  }}>Claim Tokens</a
                >
              {:else}
                <button
                  class="btn btn-primary"
                  disabled={true}
                  on:click={watchClaim}>{claimingTokens}</button
                >
              {/if}
            </div>
          </div>
          <div class="overflow-x-auto">
            <div class="flex space-x-4 justify-center my-16">
              <label class="label">Is subdomain available</label>
              <input
                class="input input-bordered"
                placeholder="enter subdomain"
                bind:value={searchText}
              />
              <button class="btn btn-outline" on:click={doSearch}>Search</button
              >
            </div>
            {#if $address}
              {#await list}
                <div class="alert alert-info">Loading sub-domains</div>
              {:then records}
                <SubdomainTable
                  title="My Records"
                  {records}
                  on:change={showChangeDialog}
                  on:transfer={() => (transferDialog = true)}
                  on:remove={() => (removeDialog = true)}
                />
              {/await}
            {:else}
              <div class="alert alert-info">
                Connect to permapages to see or purchase subdomains.
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
<Modal
  cancel={true}
  on:cancel={() => (changeDialog = false)}
  open={changeDialog}
  on:click={handleChange}
>
  <h3 class="text-3xl">Change Transaction Id</h3>
  <div class="form-control">
    <label class="label">Choose reference</label>
    <label class="label">
      <input
        type="radio"
        name="reference"
        class="radio radio-primary"
        value="permapage"
        bind:group={changeData.type}
      />
      Permapage
    </label>
    <label class="label">
      <input
        type="radio"
        name="reference"
        class="radio radio-primary"
        bind:group={changeData.type}
        value="arweave"
      />
      Arweave Transaction
    </label>
  </div>
  {#if changeData.type === "permapage"}
    <div class="form-control">
      <label class="label">Select Permapage</label>
      <select
        class="select select-bordered"
        bind:value={changeData.transactionId}
      >
        <option class="option" value="">Select Permapage</option>
        {#await listPermapages() then permapages}
          {#each permapages as p}
            <option value={p.webpage}>{p.title}</option>
          {/each}
        {/await}
      </select>
    </div>
  {/if}
  {#if changeData.type === "arweave"}
    <div class="form-control">
      <label class="label">Arweave Transaction</label>
      <input
        class="input input-bordered"
        bind:value={changeData.transactionId}
      />
    </div>
  {/if}
</Modal>
<Modal open={transferDialog}>
  <h3 class="text-2xl">🛠 Feature coming soon!</h3>
</Modal>
<Modal open={removeDialog}>
  <h3 class="text-2xl">🛠 Feature coming soon!</h3>
</Modal>
<Modal open={searchDialog} on:click={() => (searchDialog = false)}>
  <h3 class="text-2xl">Search Result</h3>
  <p class="my-8">{searchMessage}</p>
</Modal>
<Modal
  open={connectDialog}
  on:click={() => {
    connectDialog = false;
    router.goto("/connect");
  }}
>
  <h3 class="text-2xl">Wallet Connection Required!</h3>
  <p class="my-8">
    To register a subdomain you must be connected to permanotes.
  </p>
</Modal>
<Modal open={registerDialog} ok={false}>
  <h3 class="text-2xl">Register subdomain</h3>
  <table class="table">
    <tr>
      <th />
      <th>$ARNS Test</th>
      <th>$AR</th>
    </tr>
    <tr>
      <th>Balance</th>
      <td>{balance}</td>
      <td>{ar}</td>
    </tr>
    <tr>
      <th>Fee</th>
      <td>{fees ? fees[0] : "unknown"}</td>
      <td>{fees ? fees[1] : "unknown"}</td>
    </tr>
  </table>
  <form on:submit|preventDefault={submitRegistration}>
    <div class="form-control">
      <label class="label">Subdomain</label>
      <label class="input-group w-full">
        <input
          class="input input-bordered w-full"
          bind:value={registerData.subdomain}
          maxlength="20"
          pattern="[a-zA-Z0-9_]*$"
        />
        <span>.arweave.dev</span>
      </label>
      <small class="mt-2 text-secondary"
        >Only Letters and Numbers and _ maybe used to create subdomain</small
      >
    </div>
    <div class="mt-8 form-control">
      <label class="label">Choose reference</label>
      <label class="label">
        <input
          type="radio"
          name="reference"
          class="radio radio-primary"
          value="permapage"
          bind:group={registerData.type}
        />
        Permapage
      </label>
      <label class="label">
        <input
          type="radio"
          name="reference"
          class="radio radio-primary"
          bind:group={registerData.type}
          value="arweave"
        />
        Arweave Transaction
      </label>
    </div>
    {#if registerData.type === "permapage"}
      <div class="form-control">
        <label class="label">Select Permapage</label>
        <select
          class="select select-bordered"
          bind:value={registerData.transactionId}
        >
          <option class="option" value="">Select Permapage</option>
          {#await listPermapages() then permapages}
            {#each permapages as p}
              <option value={p.webpage}>{p.title}</option>
            {/each}
          {/await}
        </select>
      </div>
    {/if}
    {#if registerData.type === "arweave"}
      <div class="form-control">
        <label class="label">Arweave Transaction</label>
        <input
          class="input input-bordered"
          bind:value={registerData.transactionId}
          placeholder="Arweave Transaction Id"
        />
      </div>
    {/if}
    <div class="mt-16 flex space-x-2 justify-end">
      <button class="btn btn-primary">Register</button>
      <button
        type="button"
        class="btn"
        on:click={() => (registerDialog = false)}>Cancel</button
      >
    </div>
  </form>
</Modal>
<Modal open={successDialog}>
  <h3 class="text-3xl text-success">Success!</h3>
  <p class="my-8">
    Congrats! {successData.message}!
  </p>
  <p class="my-8">
    The processing of the gateway does take some time, it will take a few
    minutes to get your subdomain installed on the gateway.
  </p>
</Modal>

<Modal open={errorDialog}>
  <h3 class="text-3xl text-error">Error!</h3>
  <p class="my-8">
    {errorMessage}
  </p>
</Modal>

<Modal open={registering} ok={false}>
  <h3 class="text-3xl text-secondary">Registering Domain</h3>
  <div class="my-8 flex items-center justify-center">
    <Jumper size="60" color="rebeccapurple" />
  </div>
</Modal>
