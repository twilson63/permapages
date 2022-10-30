<script>
  import PagesHead from "../components/pages-head.svelte";
  import NavBar from "../components/navbar.svelte";
  import Copyright from "../widgets/copyright.svelte";
</script>

<NavBar />
<main class="container mx-auto min-h-screen">
  <PagesHead>
    <a
      href="/#/pages"
      class="btn rounded-full bg-[#F9F9F9] min-h-[2.5rem] h-[2.5rem] px-8 hover:bg-gray-200 border-none"
    >
      <img src="polygon-icon.svg" alt="polygon-icon" />
      <span class="text-[#696969] ml-4">Back</span>
    </a>
  </PagesHead>

  
</main>
<Copyright />
