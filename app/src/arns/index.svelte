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
    removeSubDomain,
    getBalance,
    getARBalance,
    getFees,
  } from "../services/registry.js";
  import { pages } from "../app.js";
  import { gql } from "../services/arweave.js";

  let changeDialog = false;
  let changeData = {};

  let removeDialog = false;
  let removeData = {};

  let connectDialog = false;
  let undernameDialog = false;
  let undernameData = {
    record: "",
    type: "permaapge",
  };
  let successDialog = false;
  let successData = {};
  let errorDialog = false;
  let errorMessage = "";
  let registering = false;
  let timeout = null;
  let timeout2 = null;
  let submitDialog = false;

  onDestroy(() => {
    clearTimeout(timeout);
    clearTimeout(timeout2);
  });

  async function addUndername() {
    if ($address) {
      undernameDialog = true;
      // load pages
      // show dialog
    } else {
      // show message dialog
      connectDialog = true;
    }
  }

  async function submitUndername() {
    undernameDialog = false;
    submitDialog = true;
    undernameData.id = (await doListANTS($address)).find(
      (rec) => rec.subdomain === undernameData.subdomain
    ).id;
    if (undernameData.id === null) {
      submitDialog = false;
      errorMessage = "Could not find ANT for subdomain";
      errorDialog = true;
      return;
    }

    const result = await updateSubDomain({
      ant: undernameData.id,
      subdomain: undernameData.record,
      transactionId: undernameData.transactionId,
    });

    submitDialog = false;
    if (result.ok) {
      list = doListANTS($address);
      successData = {
        message: "Successfully added undername",
      };
      successDialog = true;
    } else {
      errorMessage = result.message;
      errorDialog = true;
    }

    undernameData = {
      record: "",
      type: "permaapge",
    };
  }

  function showChangeDialog(e) {
    changeData = { ANT: e.detail.ANT, subdomain: e.detail.subdomain };
    changeDialog = true;
  }

  async function handleChange(e) {
    changeDialog = false;

    submitDialog = true;
    if (!changeData.transactionId || changeData.transactionId === "") {
      errorMessage = `ERROR: ${
        changeData.type === "arweave"
          ? "TransactionId is not set!"
          : "Permapage is not selected!"
      } `;
      submitDialog = false;
      errorDialog = true;
      return;
    }

    const result = await updateSubDomain({
      ant: changeData.ANT,
      subdomain: changeData.subdomain,
      transactionId: changeData.transactionId,
    }).catch((e) => console.log("CHG error", e));

    submitDialog = false;
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
  }

  function showRemoveDialog(e) {
    removeData = e.detail;
    removeDialog = true;
  }

  async function handleRemove() {
    removeDialog = false;

    const result = await removeSubDomain({
      ant: removeData.ANT,
      subdomain: removeData.subdomain,
    });
    if (result.ok) {
      successData = {
        message: "Successfully removed transaction id",
      };
      successDialog = true;
    } else {
      errorMessage = result.message;
      errorDialog = true;
    }
    removeData = {};
  }

  async function listPermapages() {
    const ps = await pages({ gql }).list($address);

    return ps.reduce(
      (acc, v) => (find(propEq(v.title, "title"), acc) ? acc : [...acc, v]),
      []
    );
  }

  async function doGetBalance() {
    try {
      const [arns, _ar] = await Promise.all([
        getBalance($address),
        getARBalance($address),
      ]).catch((e) => console.log(e));
      balance = arns;
      ar = _ar;
    } catch (e) {
      balance = "Not Found";
      ar = "Not Found";
    }
  }

  if ($address) {
    setTimeout(doGetBalance, 100);
  }

  async function doListANTS($address) {
    // load from localstorage
    $arnsCache = JSON.parse(
      localStorage.getItem(`arnsCache-${$address}`) || "[]"
    );
    // load for arweave
    const results = await listANTs($address);

    // keep only the ones not showing up in arweave gql yet
    const pending = ($arnsCache || []).filter((n) =>
      find(propEq(n.name, "name"), results) ? false : true
    );
    // update store keeping only the uncached
    $arnsCache = pending; // keep only the ANTS not found
    // return list
    return [...pending, ...results].reduce(
      (acc, v) => (find(propEq(v.id, "id"), acc) ? acc : [...acc, v]),
      []
    );
  }

  function checkDomains() {
    timeout = setTimeout(() => {
      //console.log("checking domains");
      list = doListANTS($address);
      checkDomains();
    }, 1000 * 60 * 4);
  }

  checkDomains();

  let list = doListANTS($address);
</script>

<NavBar />
<main>
  <section class="hero bg-base-200 min-h-screen items-start">
    <div class="hero-content flex-col lg:flex-row-reverse w-full">
      <div class="flex flex-col space-y-16 w-full">
        <div>
          <div class="flex items-center">
            <div class="flex-1 flex items-center space-x-8">
              <h2 class="text-2xl mb-2">
                <a class="link" href="https://ar.io/arns">SubDomains</a>
              </h2>
            </div>
            <div class="flex-none">
              <button on:click={addUndername} class="btn btn-outline"
                >Add Undername</button
              >
              <!-- {#if balance === "Not Found"}
                <a class="btn" href="/arns/claim"> Claim Tokens </a>
              {/if} -->
            </div>
          </div>
          <div class="overflow-x-auto">
            {#if $address}
              {#await list}
                <div class="alert alert-info">Loading sub-domains</div>
              {:then records}
                <SubdomainTable
                  {records}
                  on:change={showChangeDialog}
                  on:remove={showRemoveDialog}
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
  {#if changeData.subdomain !== "@"}
    <p class="my-8">Undername: {changeData.subdomain}</p>
  {/if}
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
            <option value={p.webpage || p.id}>{p.title}</option>
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
        minlength="43"
        maxlength="43"
      />
    </div>
  {/if}
</Modal>
<Modal
  open={removeDialog}
  on:click={handleRemove}
  cancel={true}
  on:cancel={() => (removeDialog = false)}
>
  <h3 class="text-2xl">Remove Transaction</h3>
  <p>
    By dropping the transaction from the subdomain, the subdomain will still
    remain under your control, the subdomain will no longer point to any arweave
    transaction.
  </p>
</Modal>
<Modal open={successDialog} on:click={() => (successDialog = false)}>
  <h3 class="text-3xl text-success">Success!</h3>
  <p class="my-8">
    Congrats! {successData.message}!
  </p>
  <p class="my-8">
    The processing of the gateway does take some time, it will take a few
    minutes to get your subdomain installed on the gateway.
  </p>
</Modal>

<Modal open={errorDialog} on:click={() => (errorDialog = false)}>
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

<Modal open={submitDialog} ok={false}>
  <h3 class="text-3xl text-secondary">Submitting Update...</h3>
  <div class="my-8 flex items-center justify-center">
    <Jumper size="60" color="#a991f7" />
  </div>
</Modal>
<Modal open={undernameDialog} ok={false}>
  <h3 class="text-2xl">Add Undername</h3>
  <p>
    An undername is a prefix to a subdomain combined with an underscore. There
    is no additional cost for an undername.
  </p>
  <form on:submit|preventDefault={submitUndername}>
    <div class="form-control">
      <label class="label">Subdomain</label>
      <select
        class="select select-bordered w-full"
        bind:value={undernameData.subdomain}
      >
        {#await list then records}
          {#each records as record}
            <option value={record.subdomain}>{record.subdomain}</option>
          {/each}
        {/await}
      </select>
    </div>
    <div class="form-control">
      <label class="label">Undername</label>
      <label class="input-group w-full">
        <input
          class="input input-bordered w-full"
          bind:value={undernameData.record}
          minlength="1"
          maxlength="20"
          pattern="^(?:[a-zA-Z0-9])+[a-zA-Z0-9-]*(?:[a-zA-Z0-9])$"
        />
        <span>_{undernameData.subdomain}.arweave.dev</span>
      </label>
      <small class="mt-2 text-secondary"
        >Only Letters and Numbers and '_,-' maybe used to create subdomain - no
        '_,-' allowed as last character.</small
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
          bind:group={undernameData.type}
        />
        Permapage
      </label>
      <label class="label">
        <input
          type="radio"
          name="reference"
          class="radio radio-primary"
          bind:group={undernameData.type}
          value="arweave"
        />
        Arweave Transaction
      </label>
    </div>
    {#if undernameData.type === "permapage"}
      <div class="form-control">
        <label class="label">Select Permapage</label>
        <select
          class="select select-bordered"
          bind:value={undernameData.transactionId}
        >
          <option class="option" value="">Select Permapage</option>
          {#await listPermapages() then permapages}
            {#each permapages as p}
              <option value={p.webpage || p.id}>{p.title}</option>
            {/each}
          {/await}
        </select>
      </div>
    {/if}
    {#if undernameData.type === "arweave"}
      <div class="form-control">
        <label class="label">Arweave Transaction</label>
        <input
          class="input input-bordered"
          bind:value={undernameData.transactionId}
          placeholder="Arweave Transaction Id"
          minlength="43"
          maxlength="43"
        />
      </div>
    {/if}
    <div class="mt-16 flex space-x-2 justify-end">
      <button class="btn btn-primary">Submit</button>
      <button
        type="button"
        class="btn"
        on:click={() => (undernameDialog = false)}>Cancel</button
      >
    </div>
  </form>
</Modal>
