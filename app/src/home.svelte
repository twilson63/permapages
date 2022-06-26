<script>
  import { address } from "./store.js";
  let version = __APP_VERSION__.split(".")[2];
</script>

<div class="hero min-h-screen bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <figure class="flex items-center justify-center">
        <img class="w-64 rounded-lg" src="permanote.png" alt="logo" />
      </figure>

      <h1 class="mt-8 text-5xl">
        <span class="uppercase text-primary">PermaNotes</span>
      </h1>
      <div class="badge badge-secondary">ALPHA {version}</div>
      <div class="flex mt-8 space-x-2">
        <h2 class="text-3xl text-secondary">✨ CREATE</h2>
        <h2 class="text-3xl text-primary">🗄 STORE</h2>
        <h2 class="text-3xl text-accent">🧠 SHARE</h2>
      </div>
      <div class="mt-16 space-x-4">
        {#if $address}
          <a href="/notes" class="btn btn-primary">My Notes</a>
        {:else}
          <a href="/connect" class="btn btn-primary">Connect</a>
        {/if}
        <a
          href="/notes/La7xUTN13SFI58-tVKSFQznRzHKY3QfVblYhV-6J-2A"
          class="btn btn-outline btn-secondary">Learn More</a
        >
      </div>
    </div>
  </div>
  <div class="hidden md:block absolute bottom-8 left-8">
    <a href="/about">
      <img
        src={window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "ar-dark.png"
          : "ar-light.png"}
        alt="permanent"
      />
    </a>
  </div>
</div>
