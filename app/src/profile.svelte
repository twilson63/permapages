<script>
  import Navbar from "./components/navbar.svelte";

  import { meta } from "tinro";
  import { handle as loadHandle } from "./services/arweave.js";
  import { notes } from "./app.js";

  const handle = decodeURI(meta().params.handle);
  const app = notes({ handle: loadHandle });

  const getHandle = async (h) => {
    const result = await app.getProfile(h);

    return result;
  };
</script>

<Navbar />
<main>
  <section class="hero min-h-screen bg-base-200">
    <div class="hero-content flex-col">
      {#await getHandle(handle) then profile}
        {#if profile}
          <img
            src={`https://arweave.net/${profile.avatar}`}
            alt={profile.name}
          />
          <h1 class="text-6xl">{profile.name}</h1>
          <p>{profile.bio}</p>
          <div class="flex space-x-8">
            <a href="/profiles/{profile.addr}/notes" class="btn btn-primary"
              >View Notes</a
            >
          </div>
        {:else}
          <h1 class="text-6xl">{handle}</h1>
          <p>Profile not found!</p>
          <p>
            Create a profile at <a
              class="underline"
              href="https://arweave.net/HOHBm7vNOoDds4uah2Du2jr7nsELJx9V0C0h54MYLes"
              >Arweave Account</a
            >
          </p>
        {/if}
      {/await}
    </div>
  </section>
</main>
