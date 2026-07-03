<script>
  import { router } from "tinro";
  import ConnectModal from "./dialogs/connect.svelte";
  import WalletHelp from "./dialogs/help-wallet.svelte";
  import NavBar from "./components/navbar.svelte";
  import { address } from "./store.js";

  let connectDlg = false;
  let walletHelp = false;

  function start() {
    if ($address) {
      router.goto("/dashboard");
    } else {
      connectDlg = true;
    }
  }

  const steps = [
    {
      n: "01",
      title: "Write",
      body: "Compose your page in markdown — words first, no code. Pick one of 29 themes, add widgets if you want them.",
    },
    {
      n: "02",
      title: "Sign",
      body: "Your wallet signs the page. That signature is the byline: cryptographic proof the page is yours.",
    },
    {
      n: "03",
      title: "Forever",
      body: "The page is stored on Arweave — a permanent, decentralized archive. No servers, no renewals, no takedowns.",
    },
  ];

  const features = [
    ["Markdown-first", "Headings, lists, quotes, code — everything you need to write well, nothing you don't."],
    ["Your license", "Attach Universal Data License terms: decide how your work may be reused, remixed, or trained on."],
    ["Your domain", "Point an ArNS name at any page and publish new versions without breaking the address."],
    ["Widgets", "Extend pages with self-contained modules — galleries, profiles, anything the community builds."],
    ["Zero cost to start", "Pages under 100KB publish free. Most pages — including this stylesheet — fit with room to spare."],
    ["Instant everywhere", "Published pages are one small file: no scripts, no trackers, first paint in a single round trip."],
  ];
</script>

<svelte:head>
  <title>PermaPages — your permanent page on the web</title>
  <meta
    content="Write in markdown, sign with your wallet, published forever on Arweave."
    name="description"
  />
</svelte:head>

<NavBar />

<main class="bg-base-100 text-base-content">
  <!-- hero -->
  <section class="container mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28">
    <div class="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="max-w-xl">
        <p class="eyebrow mb-5">Permanent &middot; No servers &middot; Yours</p>
        <h1 class="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
          Your page, printed on the permanent&nbsp;web.
        </h1>
        <p class="mt-6 text-lg leading-relaxed text-base-content/75">
          Write in markdown. Sign with your wallet. Your page is published to
          Arweave and stays up forever — long after servers, subscriptions,
          and platforms are gone.
        </p>
        <div class="mt-9 flex flex-wrap items-center gap-4">
          <button class="btn btn-primary btn-lg px-8" on:click={start}>
            {$address ? "Open your dashboard" : "Publish your first page"}
          </button>
          <a href="#how-it-works" class="link text-base-content/70 no-underline hover:text-base-content"
            >How it works &darr;</a
          >
        </div>
        <button
          class="mt-4 block text-sm text-base-content/50 underline underline-offset-4 hover:text-base-content"
          on:click={() => (walletHelp = true)}>I don't have a wallet yet</button
        >
      </div>

      <!-- the specimen: a miniature permanent page -->
      <div class="relative mx-auto w-full max-w-md" aria-hidden="true">
        <div
          class="rotate-1 rounded-xl border border-base-300 bg-[#FDFDFB] p-8 shadow-[0_24px_60px_-24px_rgba(22,24,29,0.35)]"
        >
          <p class="font-display text-2xl font-bold text-[#1d2129]">Field Notes, Vol. I</p>
          <p class="mt-3 font-display leading-relaxed text-[#1d2129]/80">
            Everything here was written once and kept forever. There is no
            edit button on history — only new editions.
          </p>
          <p class="my-5 text-center text-[0.6rem] tracking-[1em] text-[#1F6F50] pl-4">&#9670;</p>
          <p class="font-display leading-relaxed text-[#1d2129]/80">
            A page you publish today will outlive the machine you wrote it on.
          </p>
          <div class="mt-6 flex items-center justify-between border-t border-[#1d2129]/10 pt-4">
            <span class="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[#1d2129]/45"
              >Signed &middot; ar://permanent</span
            >
            <span
              class="rounded-full border border-[#1F6F50] px-3 py-1 font-sans text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#1F6F50]"
              >Forever</span
            >
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- how it works: a true sequence -->
  <section id="how-it-works" class="border-y border-base-300 bg-base-200">
    <div class="container mx-auto px-4 py-16 md:py-20">
      <p class="eyebrow mb-10">How it works</p>
      <div class="grid gap-10 md:grid-cols-3">
        {#each steps as step}
          <div>
            <div class="flex items-baseline gap-3">
              <span class="font-display text-xl font-bold text-primary">{step.n}</span>
              <h2 class="text-2xl font-bold">{step.title}</h2>
            </div>
            <p class="mt-3 leading-relaxed text-base-content/70">{step.body}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- features -->
  <section class="container mx-auto px-4 py-16 md:py-20">
    <p class="eyebrow mb-10">What you get</p>
    <div class="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {#each features as [title, body]}
        <div class="border-t border-base-300 pt-4">
          <h3 class="text-lg font-bold">{title}</h3>
          <p class="mt-2 text-sm leading-relaxed text-base-content/70">{body}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- permanence band -->
  <section class="bg-neutral text-neutral-content">
    <div class="container mx-auto px-4 py-16 text-center md:py-20">
      <p class="font-display text-3xl font-bold md:text-4xl">
        One signature. Kept for centuries.
      </p>
      <p class="mx-auto mt-4 max-w-xl leading-relaxed text-neutral-content/70">
        Arweave's storage endowment pays for your page's keep, permanently.
        You pay once — nothing at all under 100KB — and walk away.
      </p>
      <button class="btn btn-primary btn-lg mt-8 px-8" on:click={start}>
        {$address ? "Open your dashboard" : "Connect a wallet to begin"}
      </button>
    </div>
  </section>

  <footer class="border-t border-base-300">
    <div
      class="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-base-content/60 md:flex-row"
    >
      <span class="wordmark text-lg">PermaPages</span>
      <div class="flex gap-6">
        <a class="hover:text-base-content" target="_blank" href="https://github.com/twilson63/permapages">GitHub</a>
        <a class="hover:text-base-content" target="_blank" href="https://twitter.com/permapages">Twitter</a>
        <a class="hover:text-base-content" target="_blank" href="https://cookbook.arweave.net">Permaweb Cookbook</a>
      </div>
    </div>
  </footer>
</main>

<ConnectModal bind:open={connectDlg} on:help={() => (walletHelp = true)} />
<WalletHelp bind:open={walletHelp} />
