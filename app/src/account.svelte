<script>
  import { router } from "tinro";
  import { address, account } from "./store.js";
  import { profiles } from "./app.js";
  import { Jumper } from "svelte-loading-spinners";

  import {
    gql,
    postProfileTx,
    loadProfile,
    upload,
  } from "./services/arweave.js";
  import Navbar from "./components/navbar.svelte";
  import ProfileForm from "./components/profileform.svelte";
  import Modal from "./components/modal.svelte";

  let submitDialog = false;
  let editMode = false;

  const profileMgr = profiles({
    gql,
    post: postProfileTx,
    load: loadProfile,
  });

  async function getPageProfile(address) {
    const result = await profileMgr.get(address);
    console.log(result);
    $account = { id: address, profile: result };
    return result;
  }

  async function handleCreate({ detail: { profile, avatar, background } }) {
    submitDialog = true;

    profile.avatar = avatar ? await upload(avatar) : profile.avatar;
    profile.background = background
      ? await upload(background)
      : profile.background;
    profile.owner = $address;
    const result = await profileMgr.create(profile);
    //console.log(result);
    submitDialog = false;
    editMode = false;
    profileObject = await getPageProfile($address);
  }

  function disconnect() {
    if (window.arweaveWallet) window.arweaveWallet.disconnect();
    address.set("");
    router.goto("/connect");
  }

  let profileObject = getPageProfile($address);
</script>

<Navbar />
<main>
  <section class="hero min-h-screen bg-base-200">
    <div class="hero-content flex-col">
      {#await profileObject then p}
        {#if editMode && p}
          <h1 class="text-6xl">Create a PermaProfile</h1>
          <ProfileForm profile={p} on:create={handleCreate} />
        {:else if !editMode && p}
          <!-- show new profile widget -->
          <img
            class="mask mask-squircle"
            src={`https://arweave.net/${p.avatar}`}
            alt={p.name}
            width="94"
            height="94"
          />
          <h1 class="text-6xl">{p.name}</h1>
          <p>{p.bio ? p.bio : ""}</p>
          <div class="flex space-x-8">
            <a href="/pages" class="btn btn-primary">Pages</a>
            <button
              class="btn"
              on:click|preventDefault={() => (editMode = true)}>Edit</button
            >
            <button class="btn" on:click|preventDefault={disconnect}
              >Disconnect</button
            >
          </div>
        {:else}
          <h1 class="text-6xl">Create a PermaProfile</h1>
          <ProfileForm profile={{ links: {} }} on:create={handleCreate} />
        {/if}
      {/await}
    </div>
  </section>
</main>
<Modal open={submitDialog}>
  <h3 class="font-bold md:text-lg mb-8">Submitting Profile</h3>
  <div class="flex items-center justify-center">
    <Jumper size="60" color="rebeccapurple" unit="px" duration="2s" />
  </div>
</Modal>
