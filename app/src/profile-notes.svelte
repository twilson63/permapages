<script>
  import { meta } from "tinro";
  import Navbar from "./components/navbar.svelte";
  import NoteCard from "./components/note-card.svelte";
  import { Jumper } from "svelte-loading-spinners";
  import { gql, handle as loadHandle } from "./services/arweave.js";
  import { notes } from "./app.js";
  import propEq from "ramda/src/propEq";
  import find from "ramda/src/find";

  let loading = true;
  let favoriteSetup = false;
  let bytopics = false;
  let handle = meta().params.handle;
  let profile = { name: "unknown" };

  async function listNotes() {
    try {
      loading = true;
      const app = notes({ gql, handle: loadHandle });
      profile = await app.getProfile(handle);
      const results = await app.byProfile(handle);

      loading = false;
      return results
        .filter(propEq("public", true))
        .reduce(
          (acc, v) => (find(propEq("slug", v.slug), acc) ? acc : [...acc, v]),
          []
        );
    } catch (e) {
      loading = false;
      alert(e.message);
      return [];
    }
  }

  async function listFavorites() {
    favoriteSetup = true;
    /*
    try {
      const app = notes();
      const profile = await app.getProfile($address);
      if (profile.favoriteContract) {
        const results = await app.favorites($address);
        return results;
      } else {
        favoriteSetup = true;
      }
    } catch (e) {
      favoriteSetup = false;
    }
    */
  }
</script>

<!--
<div class="drawer drawer-mobile">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
  -->
<Navbar />
<main>
  <section class="hero bg-base-200 min-h-screen items-start">
    <div class="hero-content flex-col w-full">
      <div class="flex w-full">
        <h1 class="text-2xl flex-1">
          Notes by User: <a class="underline" href="/profiles/{handle}"
            >@{profile.name}</a
          >
        </h1>
        {#if false}
          <div class="flex-none flex space-x-4">
            <button class="btn btn-primary">Follow</button>
          </div>
        {/if}
      </div>
      <div class="flex flex-col space-y-4 w-full">
        {#await listNotes() then notes}
          {#each notes as note}
            <NoteCard
              id={note.id}
              title={note.title}
              description={note.description}
              topic={note.topic}
              timestamp={note.timestamp}
            />
          {/each}
        {/await}
      </div>
    </div>
  </section>
</main>
<!--
  </div>
  <div class="drawer-side">
    <label for="my-drawer" class="drawer-overlay" />
    <ul class="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
      <li><h2 class="text-2xl mb-8">Filter Options</h2></li>
      <li><button class="btn btn-ghost">My Notes</button></li>
      <li>
        <button on:click={listFavorites} class="btn btn-ghost">Favorites</button
        >
      </li>
      <li>
        <button class="btn btn-ghost" on:click={() => (bytopics = true)}
          >By Topic</button
        >
      </li>
      <li><h3 class="text-xl">Following</h3></li>
    </ul>
  </div>
</div>
-->

<input
  type="checkbox"
  id="save-note"
  bind:checked={loading}
  class="modal-toggle"
/>
<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Loading Notes</h3>
    <div class="flex items-center justify-center">
      <Jumper size="60" color="rebeccapurple" unit="px" duration="2s" />
    </div>
  </div>
</div>

<input
  type="checkbox"
  id="setup-favorites"
  bind:checked={favoriteSetup}
  class="modal-toggle"
/>
<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Setup Favorites</h3>
    <p>
      Every time you like a public note, you can include it in your favorites
      list, in order to create your favorites list just click 'Setup'
    </p>
    <div class="flex items-center justify-center">
      <button class="btn btn-primary" on:click={() => (favoriteSetup = false)}
        >Setup Favorite</button
      >
    </div>
  </div>
</div>

<input
  type="checkbox"
  id="by-topic"
  bind:checked={bytopics}
  class="modal-toggle"
/>
<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Feature available soon!</h3>
    <p>
      This feature will allow users to enter a topic to find public notes and
      their private notes for that topic.
    </p>
    <div class="flex items-center justify-center">
      <button class="btn btn-primary" on:click={() => (bytopics = false)}
        >OK</button
      >
    </div>
  </div>
</div>
