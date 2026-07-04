<script>
  import NavBar from "../components/navbar.svelte";
  import { gql } from "../services/gql.js";
  import { pages } from "../app.js";
  import { address, pageCache } from "../store.js";
  import Modal from "../components/modal.svelte";
  import PageTable from "../components/pages.svelte";
  import find from "ramda/src/find";
  import propEq from "ramda/src/propEq";

  let successDialog = false;
  let successData = {};

  const { list } = pages({ gql });

  const account = $address;

  async function listPages() {
    const results = await list(account);
    console.log(results[0]);
    const pending = ($pageCache || []).filter((n) =>
      find(propEq(n.id, "id"), results) ? false : true
    );

    // clean cache if in results
    // $cache = ($cache || []).reduce((acc, v) => {
    //   acc = find(propEq("id", v.id), results) ? acc : [...acc, v];
    // }, []);

    // rollup by slugs
    const xs = [...pending, ...results].reduce(
      //const xs = results.reduce(
      (acc, v) => (find(propEq(v.title, "title"), acc) ? acc : [...acc, v]),
      []
    );

    return xs;
  }

  const pageList = listPages();
</script>

<NavBar />
<main class="min-h-screen bg-base-200">
  <div class="container mx-auto px-4 py-10">
    <p class="eyebrow mb-2">Library</p>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-3xl font-bold">Your pages</h1>
      <a href="/pages/new" class="btn btn-primary">New page</a>
    </div>

    <div class="mt-8">
      {#await pageList}
        <div class="rounded-xl border border-base-300 bg-base-100 p-4" aria-busy="true" aria-label="Loading pages">
          {#each [0, 1, 2, 3] as row}
            <div class="flex items-center justify-between gap-6 border-b border-base-200 py-4 last:border-none">
              <div class="skeleton-line h-4 w-2/5"></div>
              <div class="skeleton-line hidden h-3 w-24 md:block"></div>
              <div class="skeleton-line h-6 w-24 rounded-full"></div>
            </div>
          {/each}
        </div>
      {:then records}
        <PageTable {records} />
      {/await}
    </div>
  </div>
</main>

<Modal open={successDialog}>
  <h3 class="text-3xl text-success">{successData.title}</h3>
  <p class="my-4">{successData.description}</p>
</Modal>
