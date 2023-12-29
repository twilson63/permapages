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
<main>
  <section class="hero bg-base-200 min-h-screen items-start">
    <div class="hero-content flex-col lg:flex-row-reverse w-full">
      <div class="flex flex-col space-y-16 w-full">
        <div>
          <div class="flex">
            <h2 class="text-2xl mb-2 flex-1">Your Pages</h2>
            <div class="flex-none6">
              <a href="/pages/new" class="btn btn-primary">New Web Page</a>
            </div>
          </div>
          <div class="overflow-x-auto">
            {#await pageList}
              Loading...
            {:then records}
              <PageTable {records} />
            {/await}
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<Modal open={successDialog}>
  <h3 class="text-3xl text-success">{successData.title}</h3>
  <p class="my-4">{successData.description}</p>
</Modal>
