<script>
  import NavBar from "../components/navbar.svelte";
  import Modal from "../components/modal.svelte";
  import ProfileForm from "../components/profileform.svelte";
  import { address, account } from "../store.js";
  import { profiles } from "../app.js";
  import { Jumper } from "svelte-loading-spinners";
  import { postProfileTx, loadProfile, upload } from "../services/arweave.js";
  import { gql } from "../services/gql.js";

  import { router } from "tinro";

  let submitDialog = false;
  let errorDialog = false;
  let errorMessage = "";
  let successDialog = false;

  async function getPageProfile(address) {
    const result = await profileMgr.get(address);

    return Object.assign({ links: {} }, result);
  }

  const profileMgr = profiles({
    gql,
    post: postProfileTx,
    load: loadProfile,
  });
  async function handleCreate({ detail: { profile, avatar, background } }) {
    try {
      submitDialog = true;
      // upload avatar
      profile.avatar = avatar ? await upload(avatar, $address) : profile.avatar;

      // upload background
      profile.background = background
        ? await upload(background, $address)
        : profile.background;

      profile.owner = $address;
      // save profile
      await profileMgr.create(profile);

      submitDialog = false;
      router.goto("/account");
      successDialog = true;
    } catch (e) {
      submitDialog = false;
      errorMessage = e.message;
      errorDialog = true;
    }
  }

  let profileObject = getPageProfile($address);
</script>

<NavBar />

<main>
  <section class="hero bg-base-200 min-h-screen items-start">
    <div class="hero-content flex-col lg:flex-row-reverse w-full">
      <div class="flex space-x-8">
        <div class="card shadow-xl w-1/2 flex-1">
          <div class="card-body">
            <h1 class="card-title text-6xl">Enhance Profile</h1>
            <p class="text-2xl">
              Add links, change upload an avatar and background, and more.
            </p>
            <img src="/permapages_logo.svg" alt="permapages_logo" />
          </div>
        </div>
        <div class="flex-0 mt-8">
          {#await profileObject then p}
            <ProfileForm profile={p} on:create={handleCreate} />
          {/await}
        </div>
      </div>
    </div>
  </section>
</main>
<Modal open={submitDialog} ok={false}>
  <h3 class="font-bold md:text-lg mb-8">Submitting Profile</h3>
  <div class="flex items-center justify-center">
    <Jumper size="60" color="rebeccapurple" unit="px" duration="2s" />
  </div>
</Modal>

<Modal open={errorDialog}>
  <h3 class="text-3xl text-error">Error!</h3>
  <p class="my-8">
    {errorMessage}
  </p>
</Modal>

<Modal open={successDialog}>
  <h3 class="text-3xl text-error">Success!</h3>
  <p class="my-8">Profile has been updated!</p>
</Modal>
