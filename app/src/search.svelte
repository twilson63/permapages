<script>
  import { meta } from "tinro";
  import Navbar from "./components/navbar.svelte";
  import NoteCard from "./components/note-card.svelte";
  import { Jumper } from "svelte-loading-spinners";
  import SearchForm from "./components/search-form.svelte";
  import { address } from "./store.js";

  import { gql } from "./services/arweave.js";
  import { notes } from "./app.js";

  import propEq from "ramda/src/propEq";
  import find from "ramda/src/find";
  import and from "ramda/src/and";
  import or from "ramda/src/or";

  let loading = false;
  let q = decodeURI(meta().query.q || "");
  let search = false;

  async function listNotes(searchTxt) {
    q = searchTxt ? searchTxt : q;
    const app = notes({ gql });
    loading = true;
    let results = await app.search(q);
    loading = false;
    results = $address
      ? results.filter(
          or(
            and(propEq("owner", $address), propEq("public", false)),
            propEq("public", true)
          )
        )
      : results.filter(propEq("public", true));

    return results.reduce(
      (acc, v) => (find(propEq("slug", v.slug), acc) ? acc : [...acc, v]),
      []
    );
    //return Promise.resolve([]);
  }
  function doSearch(e) {
    search = false;
    noteResults = listNotes(e.detail.q);
  }
  let noteResults = listNotes();
</script>

<Navbar />
<main>
  <section class="hero bg-base-200 min-h-screen items-start">
    <div class="hero-content flex-col w-full">
      {#if search}
        <SearchForm on:search={doSearch} />
      {/if}
      <div class="flex w-full">
        <h1 class="text-2xl flex-1">Notes by Search: "{q}"</h1>
        <div class="flex-none flex space-x-4">
          <button
            on:click={() => {
              search = !search;
            }}
            class="btn btn-ghost"
          >
            <img src="search.svg" alt="search button" style="width: 32px;" />
          </button>
          <a href="/notes/new" class="btn btn-primary">New Note</a>
        </div>
      </div>
      <div class="flex flex-col space-y-4 w-full">
        {#await noteResults then notes}
          {#each notes as note}
            <NoteCard
              id={note.id}
              title={note.title}
              description={note.description}
              topic={note.topic}
              timestamp={note.timestamp}
              cached={false}
            />
          {/each}
        {/await}
      </div>
    </div>
  </section>
</main>
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
