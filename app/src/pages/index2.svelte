<script>
  import PagesHead from "../components/pages-head.svelte";
  import NavBar from "../components/navbar.svelte";
  import ActionCards from "../components/pages-cards.svelte";
</script>

<NavBar />
<main class="container mx-auto min-h-screen">
  <PagesHead>
    <h1 class="txt-gradient text-2xl font-bold">
      You’re all set to create on the Permaweb.
    </h1>
    <h3 class="text-gray-400 text-lg font-semibold">
      Select your next step below.
    </h3>
  </PagesHead>
  
  <ActionCards />

  <div
    class="flex flex-row items-center gap-2 w-[220px] mx-auto justify-center my-10 py-2 rounded-full
    bg-gradient-to-r from-[#FF00E5] to-[#7B55EC] drop-shadow-lg cursor-pointer"
  >
    <img src="magic-hand.png" alt="magic-hand" width="30px" />
    <span class="text-white font-semibold">Created on Compose</span>
  </div>
</main>
