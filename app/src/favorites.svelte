<script>
  import { router } from "tinro";
  import { address } from "./store.js";
  import { gql } from "./services/arweave.js";
  import { notes } from "./app.js";
  import Navbar from "./components/navbar.svelte";

  const app = notes({ gql });
  function getFavorites() {
    return app.favorites($address);
  }
</script>

<Navbar />
<main>
  <section
    class="mt-8 text-base-600 relative w-full px-6 py-12 bg-base-200 shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 md:max-w-3xl md:mx-auto lg:max-w-4xl lg:pt-16 lg:pb-28 prose prose-lg"
  >
    <h1 class="text-6xl">Favorites</h1>
    {#await getFavorites() then favorites}
      {#each favorites as favorite}
        <div class="card">
          <a href="/notes/{favorite.id}">{favorite.title}</a>
        </div>
      {:else}
        <div>No Favorites, to create a favorite, just "like" a note!</div>
      {/each}
    {/await}
  </section>
</main>
