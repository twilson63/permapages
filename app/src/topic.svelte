<script>
  import { meta } from "tinro";
  import Navbar from "./components/navbar.svelte";
  import NoteCard from "./components/note-card.svelte";
  import SearchForm from "./components/search-form.svelte";
  import { Jumper } from "svelte-loading-spinners";
  import { address, topics } from "./store.js";
  import { gql, topics as _topics } from "./services/arweave.js";
  import { notes } from "./app.js";
  import propEq from "ramda/src/propEq";
  import find from "ramda/src/find";
  import and from "ramda/src/and";
  import or from "ramda/src/or";

  let search = false;
  let loading = true;
  let favoriteSetup = false;
  let bytopics = false;
  let topic = decodeURI(meta().params.topic);

  async function listNotes() {
    try {
      loading = true;
      let results = await notes({ gql }).byTopic(topic);
      loading = false;

      results = results.filter(propEq(true, "public"));

      return results.reduce(
        (acc, v) => (find(propEq(v.slug, "slug"), acc) ? acc : [...acc, v]),
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
        <h1 class="text-2xl flex-1">Notes by Topic: #{topic}</h1>
        <div class="flex-none flex space-x-4">
          {#if $topics.includes(topic)}
            <button
              class="btn btn-primary"
              on:click={async () => {
                try {
                  await _topics.unsubscribe(topic);
                  $topics = $topics.filter((t) => t !== topic);
                } catch (e) {
                  alert("Something went wrong trying to unsubscribe to topic");
                }
              }}>Unsubscribe</button
            >
          {:else}
            <button
              class="btn btn-primary"
              on:click={async () => {
                try {
                  await _topics.subscribe(topic);
                  $topics = [...$topics, topic];
                } catch (e) {
                  alert("Something went wrong trying to subscribe to topic");
                }
              }}>Subscribe</button
            >
          {/if}
        </div>
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
        <!--
            <NoteCard
              tx="2"
              title="goodbye"
              description="A note about goodbye"
              topic="work"
            />
            -->
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
