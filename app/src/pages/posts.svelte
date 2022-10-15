<script>
  import PagesHead from "../components/pages-head.svelte";
  import NavBar from "../components/navbar.svelte";
</script>

<NavBar />
<main class="container mx-auto min-h-screen">
  <PagesHead />
  <h1>Blog Post</h1>

  <div
    class="flex flex-row items-center gap-2 w-[220px] mx-auto justify-center my-10 py-2 rounded-full
    bg-gradient-to-r from-[#FF00E5] to-[#7B55EC] drop-shadow-lg cursor-pointer"
  >
    <img src="magic-hand.png" alt="magic-hand" width="30px" />
    <span class="text-white font-semibold">Created on Compose</span>
  </div>
</main>
