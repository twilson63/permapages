<script>
  import NavBar from "../components/navbar.svelte";
  import Modal from "../components/modal.svelte";
  import { pages } from "../app.js";
  import { gql } from "../services/arweave.js";
  import { address } from "../store.js";

  import find from "ramda/src/find";
  import propEq from "ramda/src/propEq";

  import { meta } from "tinro";
  import {
    updateSubDomain,
    removeSubDomain,
    getANT,
  } from "../services/registry.js";

  let changeDialog = false;
  let changeData = {};

  let removeDialog = false;
  let removeData = {};

  let successDialog = false;
  let successData = {};

  let errorDialog = false;
  let errorData = {};

  async function handler(dialog, data, fn) {
    dialog = false;
    if (!data.ant) {
      errorData = { message: "Could not find ANT" };
      errorDialog = true;
      return;
    }
    const result = await fn(data);
    if (result.ok) {
      successData = {
        message: result.message,
      };
      successDialog = true;
    } else {
      errorData = {
        message: result.message,
      };
      errorDialog = true;
    }
    data = {};
  }

  function handleChange() {
    handler(changeDialog, changeData, updateSubDomain);
  }

  function handleRemove() {
    handler(removeDialog, removeData, removeSubDomain);
  }

  async function listPermapages() {
    const ps = await pages({ gql }).list($address);

    return ps.reduce(
      (acc, v) => (find(propEq("title", v.title), acc) ? acc : [...acc, v]),
      []
    );
  }
</script>

<NavBar />
<main>
  <section class="hero bg-secondary text-secondary-content min-h-[200px]">
    <div class="hero-content flex-col lg:flex-row-reverse w-full">
      <h1 class="text-6xl font-bold flex justify-center items-center space-x-8">
        Arweave Name Token (ANT)
        <figure class="p-8">
          <img
            src="https://tgbcqufuppegmlhigt2zosiv2q55qty4t4rg2gebmfm4vpvf.arweave.net/mYIoULR7yGYs_6DT1_l0kV1DvYTxyfIm0YgWFZyr6l0"
            alt="arweave logo"
            class="rounded-x1 h-[64px]"
          />
        </figure>
      </h1>
    </div>
  </section>
  {#await getANT(meta().params.ant) then ant}
    <section class="hero bg-base-200 min-h-[200px]">
      <div class="hero-content flex-col lg:flex-row-reverse w-full">
        <div class="flex flex-col space-y-16 w-full">
          <h2 class="text-3xl">
            {ant.ticker} - (https://{ant.name}.arweave.dev)
          </h2>
        </div>
      </div>
    </section>
    <section class="hero bg-base-100 min-h-[200px]">
      <div class="hero-content flex-col w-full">
        <div class="flex mt-8 w-full">
          <h3 class="flex-1 text-2xl">Records</h3>
          <div class="flex-none">
            <button class="btn btn-primary">Add Record</button>
            <a href="/arns" class="btn btn-secondary">ArNS</a>
          </div>
        </div>

        {#each Object.keys(ant.records) as key}
          <div class="card w-full bg-primary text-primary-content shadow-xl">
            <div class="card-body">
              <h3 class="card-title">
                Record: {key === "@" ? ant.name : key}.arweave.dev
              </h3>
              <p>{`TransactionId: ${ant.records[key]} TTL: 900`}</p>
              <div class="card-actions justify-end">
                <button
                  class="btn"
                  on:click={() => {
                    changeData = {
                      ant: ant.id,
                      subdomain: key,
                    };
                    changeDialog = true;
                  }}>Change</button
                >
                <button
                  class="btn"
                  on:click={() => {
                    removeData = {
                      ant: ant.id,
                      subdomain: key,
                    };
                    removeDialog = true;
                  }}>Remove</button
                >
              </div>
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/await}
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
    🎉 {successData.message}!
  </p>
  <p class="my-8">
    The processing of the gateway does take some time, it will take a few
    minutes to get your subdomain installed on the gateway.
  </p>
</Modal>

<Modal open={errorDialog} on:click={() => (errorDialog = false)}>
  <h3 class="text-3xl text-error">Error!</h3>
  <p class="my-8">
    {errorData.message}
  </p>
</Modal>
