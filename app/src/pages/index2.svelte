<script>
  import PagesHead from "../components/pages-head.svelte";
  import NavBar from "../components/navbar.svelte";
  import ActionCards from "../components/pages-cards.svelte";
  import Copyright from "../widgets/copyright.svelte";
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

  <Copyright />
</main>
