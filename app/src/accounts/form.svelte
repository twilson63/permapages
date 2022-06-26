<script>
  import NavBar from "../components/navbar.svelte";
  import ProfileForm from "../components/profileform.svelte";
  import { router } from "tinro";
</script>

<NavBar />

<main>
  <section class="hero bg-base-200 min-h-screen items-start">
    <div class="hero-content flex-col lg:flex-row-reverse w-full">
      <div class="flex flex-col space-y-16 w-full">
        <ProfileForm />
      </div>
    </div>
  </section>
</main>
