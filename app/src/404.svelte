<script>
  import Navbar from "./components/navbar.svelte";
  import { meta } from "tinro";
  const metaInfo = meta();
</script>

<Navbar />
<main class="hero max-h-screen bg-base-100">
  <section class="hero-content flex-col">
    <h1 class="text-6xl">404</h1>
    <p class="text-2xl">Note not found!</p>
    <div class="mt-16 alert alert-warning flex flex-col w-1/2">
      There is a known bug that is causing some view notes to error out, we are
      currently working to resolve, but until then, you can click try again and
      there is a good chance the note you are trying to view will load.
      <div class="flex mt-8">
        <a href={metaInfo.from} class="btn btn-secondary">Try Again</a>
      </div>
    </div>
  </section>
</main>
