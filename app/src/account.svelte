<script>
  import { router } from "tinro";
  import { address, account, topics } from "./store.js";
  import Navbar from "./components/navbar.svelte";
  import ProfileForm from "./components/profileform.svelte";

  const profile = $account.profile;

  function disconnect() {
    if (window.arweaveWallet) window.arweaveWallet.disconnect();
    address.set("");
    router.goto("/connect");
  }
</script>

<Navbar />
<main>
  <section class="hero min-h-screen bg-base-200">
    <div class="hero-content flex-col">
      {#if profile}
        <img
          class="mask mask-squircle"
          src={`https://arweave.net/${profile.avatar}`}
          alt={profile.name}
          width="94"
          height="94"
        />
        <h1 class="text-6xl">{profile.name}</h1>
        <p>{profile.bio ? profile.bio : ""}</p>
      {:else}
        <h1 class="text-6xl">Create a PermaProfile</h1>
        <ProfileForm />
      {/if}
      <div class="flex space-x-8">
        <a href="/pages" class="btn btn-primary">Pages</a>
        <button class="btn" on:click|preventDefault={disconnect}
          >Disconnect</button
        >
      </div>
    </div>
  </section>
</main>
