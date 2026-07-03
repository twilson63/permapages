<script>
  import NavBar from "./components/navbar.svelte";
  import Balances from "./components/dashboard-balances.svelte";
  import { address, account } from "./store.js";
  import { takeLast } from "ramda";

  const actions = [
    {
      title: "Write a post",
      body: "Author a permanent piece — signed, dated, and kept forever.",
      href: "/posts/new",
      cta: "New post",
    },
    {
      title: "Build a page",
      body: "A fully custom page in markdown or HTML, with themes and widgets.",
      href: "/pages/new",
      cta: "New page",
    },
    {
      title: "Manage domains",
      body: "Point your ArNS names and undernames at the pages you publish.",
      href: "/arns",
      cta: "Open domains",
    },
  ];
</script>

<NavBar />
<main class="min-h-screen bg-base-200">
  <div class="container mx-auto px-4 py-10">
    <p class="eyebrow mb-2">Studio</p>
    <div class="flex flex-wrap items-baseline justify-between gap-2">
      <h1 class="text-3xl font-bold">
        {$account?.profile?.name ? `Welcome back, ${$account.profile.name}.` : "Welcome back."}
      </h1>
      {#if $address}
        <span class="font-mono text-xs text-base-content/50">&hellip;{takeLast(6, $address)}</span>
      {/if}
    </div>

    <div class="mt-8">
      <Balances />
    </div>

    <div class="mt-10 grid gap-4 md:grid-cols-3">
      {#each actions as action}
        <a
          href={action.href}
          class="group flex flex-col rounded-xl border border-base-300 bg-base-100 p-6 transition-colors hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <h2 class="text-xl font-bold">{action.title}</h2>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-base-content/70">{action.body}</p>
          <span class="mt-5 text-sm font-semibold text-primary">
            {action.cta} <span class="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
          </span>
        </a>
      {/each}
    </div>
  </div>
</main>
