<script>
  import { router } from "tinro";
  import { address, account } from "./store.js";
  import { profiles } from "./app.js";
  import { Jumper } from "svelte-loading-spinners";
  import ProfileView from "./components/profile.svelte";

  import {
    gql,
    postProfileTx,
    loadProfile,
    upload,
  } from "./services/arweave.js";
  import Navbar from "./components/navbar.svelte";
  import Modal from "./components/modal.svelte";

  let submitDialog = false;
  let name = "";

  const profileMgr = profiles({
    gql,
    post: postProfileTx,
    load: loadProfile,
  });

  async function getPageProfile(address) {
    const result = await profileMgr.get(address);
    $account = { id: address, profile: result };
    return result;
  }

  async function handleCreate() {
    try {
      submitDialog = true;

      // profile.avatar = avatar ? await upload(avatar, $address) : profile.avatar;
      // profile.background = background
      //   ? await upload(background, $address)
      //   : profile.background;
      let profile = {
        name,
        owner: $address,
        links: {},
      };
      const result = await profileMgr.create(profile);
      submitDialog = false;
      //profileObject = await getPageProfile($address);
      router.goto("/pages");
    } catch (e) {
      submitDialog = false;
      alert("ERROR: " + e.message);
    }
  }

  function disconnect() {
    if (window.arweaveWallet) window.arweaveWallet.disconnect();
    localStorage.setItem("arweave-app", "");
    address.set("");
    router.goto("/connect");
  }

  let profileObject = getPageProfile($address);
</script>

<Navbar />
<main>
  <section class="hero min-h-screen bg-base-200 items-start">
    <div class="hero-content flex-col w-full">
      {#await profileObject then p}
        {#if p}
          <ProfileView profile={p} />
          <div class="flex space-x-2">
            <a href="/pages" class="btn btn-secondary">Pages</a>
            <a class="btn btn-primary" href="/account/edit">Edit Profile</a>
            <button class="btn btn-outline" on:click|preventDefault={disconnect}
              >Disconnect</button
            >
          </div>
        {:else}
          <div class="flex space-x-8">
            <div class="card shadow-xl w-1/2 flex-1">
              <div class="card-body">
                <h1 class="card-title text-6xl">New Profile</h1>
                <p class="text-2xl">
                  Get started by adding your username, you can enhance your full
                  web3 profile later.
                </p>
                <img src="/permapages_logo.svg" alt="permapages_logo" />
              </div>
            </div>
            <div class="flex-0 mt-8">
              <form
                class="w-full h-full"
                on:submit|preventDefault={handleCreate}
              >
                <div class="relative h-full">
                  <h4 class="mt-4 text-2xl">Account Information</h4>
                  <p class="text-sm">
                    Add your username, with no spaces, it should be less than 20
                    characters.
                  </p>
                  <div class="form-control mt-8">
                    <label for="name" class="label"
                      >Name <span class="text-secondary">* required</span
                      ></label
                    >
                    <input
                      id="name"
                      name="name"
                      required
                      maxlength="20"
                      pattern="[^' ']+"
                      class="input input-bordered input-secondary"
                      bind:value={name}
                    />
                    <small class="mt-2"
                      >(20 characters max, no spaces allowed)</small
                    >
                  </div>
                  <div class="mt-8">
                    <button class="w-full btn btn-primary">Save</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        {/if}
      {:catch err}
        <img
          src="/permapages_logo.svg"
          alt="app logo"
          class="h-[300px] w-[300px]"
        />
        <div class="alert alert-error m-32 flex-col">
          <h1 class="text-6xl">Something went wrong!</h1>
          <p>{err.message}</p>
        </div>
      {/await}
    </div>
  </section>
</main>
<Modal open={submitDialog} ok={false}>
  <h3 class="font-bold md:text-lg mb-8">Submitting Profile</h3>
  <div class="flex items-center justify-center">
    <Jumper size="60" color="rebeccapurple" unit="px" duration="2s" />
  </div>
</Modal>
