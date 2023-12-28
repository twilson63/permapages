<script>
  import PagesHead from "../components/pages-head.svelte";
  import NavBar from "../components/navbar.svelte";
  import PagesPosts from "../components/pages-posts.svelte";
  import PagesDrafts from "../components/pages-drafts.svelte";
  import Copyright from "../widgets/copyright.svelte";
  import { posts } from "../api.js";
  import { address } from "../store.js";

  async function postData() {
    const result = await posts.list($address);
    return result;
  }
</script>

<NavBar />
<main class="container mx-auto min-h-screen">
  <!-- <PagesHead>
    <a
      href="/dashboard"
      class="btn rounded-full bg-[#F9F9F9] min-h-[2.5rem] h-[2.5rem] px-8 hover:bg-gray-200 border-none"
    >
      <img src="polygon-icon.svg" alt="polygon-icon" />
      <span class="text-[#696969] ml-4">Back</span>
    </a>
  </PagesHead> -->
  {#await postData() then posts}
    <PagesPosts {posts} />
  {/await}
  <!--
  <PagesDrafts {drafts} />
  -->

  <!-- <Copyright /> -->
</main>
