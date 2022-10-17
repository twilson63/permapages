<script>
  import { meta } from "tinro";
  import Navbar from "../components/navbar.svelte";
  import Modal from "../components/modal.svelte";
  import { loadPage, loadState, gql } from "../services/arweave.js";
  import { register, listANTs, updateSubDomain } from "../services/registry.js";
  import { pages, widgets } from "../app.js";
  import { address } from "../store.js";
  import markdownIt from "markdown-it";
  import container from "markdown-it-container";
  import attrs from "markdown-it-attrs";
  import { onMount } from "svelte";
  import compose from "ramda/src/compose";
  import mergeAll from "ramda/src/mergeAll";
  import join from "ramda/src/join";
  import split from "ramda/src/split";
  import toLower from "ramda/src/toLower";
  import find from "ramda/src/find";
  import propEq from "ramda/src/propEq";

  let advanced = false;
  var easymde = null;
  let error = null;
  let confirm = false;
  let widgetDialog = false;

  let allWidgets = [];
  let ant = null;

  let themes = [
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "aqua",
    "night",
    "coffee",
  ];

  // create extenstion to support :::info
  const md = markdownIt({ html: true, linkify: true });

  md.use(container, "info", {
    validate: function (params) {
      return params.trim().match(/^(info|success|warning|error)+$/);
    },
    render: function (tokens, idx) {
      var m = tokens[idx].info.trim().match(/^(.*)+$/);
      if (tokens[idx].nesting === 1) {
        return `<div class="my-2 py-2 alert alert-${m[1]} block prose-p:block dark:prose-strong:text-black prose-code:rounded-full prose-code:bg-black prose-code:px-[8px] prose-code:py-[4px] prose-code:text-white prose-code:p-0 prose-code:m-0 prose-code:mt-[3px]">`;
      } else {
        return "</div>";
      }
    },
  });

  md.use(attrs);

  const slugify = compose(toLower, join("-"), split(" "));

  onMount(async () => {
    loadWidgets().then((widgets) => {
      allWidgets = widgets;
    });
    easymde = new window.EasyMDE({
      autosave: {
        enabled: true,
        uniqueId: "new-permapage",
      },
      previewClass: "bg-base-200 p-4 prose prose-lg",
      spellChecker: false,
      nativeSpellcheck: false,
      //inputStyle: "contenteditable",
      //forceSync: true,
      previewRender: (txt) => md.render(txt),
      //previewClass: "prose md:prose-lg lg:prose-xl m-8 md:mx-24",
    });
    // if (!meta().query.fork) {
    //   easymde.value = "";
    //   page.content = "";
    // }
  });

  let page = {
    public: true,
    widgets: [],
    includeFooter: true,
    allowStamps: false,
  };

  if (meta().query.fork) {
    // getNote from meta().query.fork
    pages({ load: loadPage, loadState })
      .get(meta().query.fork)
      .then(async (p) => {
        page.title = p.title;
        if (p.code) {
          page.code = p.code;
        }
        page.description = p.description;
        page.subdomain = p.subdomain;
        easymde.value(p.content);
        page.content = p.content;
        page.profile = p.profile;
        page.ethwallet = p.ethwallet;
        page.webpage = p.webpage;
        page.theme = p.theme;
        page.widgets = p.widgets || [];
        page.includeFooter = p.includeFooter || true;
        page.allowStamps = p.allowStamps || true;
        page.state = mergeAll(
          {
            ticker: "PAGE-" + slugify(p.title),
            name: "Permapage",
            title: p.title,
            owner: p.owner,
            balances: {
              [$address]: 10000,
            },
            contentType: "text/html",
            createdAt: Date.now(),
            invocations: [],
            halted: false,
            pairs: [],
            usedTransfers: [],
            foreignCalls: [],
            emergencyHaltWallet: $address,
            claims: [],
            claimable: [],
            settings: [["isTradeable", true]],
          },
          p.state
        );

        const ants = await listANTs($address);
        ant = ants.find((ant) =>
          ant.records["@"]?.transactionId
            ? ant.records["@"].transactionId === page.webpage
            : ant.records["@"] === page.webpage
        )?.id;
      });
  } else {
  }

  async function submit() {
    confirm = true;
  }

  async function loadWidgets() {
    const ws = await widgets({ gql }).list();

    return ws
      .filter(
        (w) =>
          !["widget-connector", "widget-poap", "widget-stamp"].includes(w.name)
      )
      .reduce((a, v) => (find(propEq("name", v.name), a) ? a : [...a, v]), []) // only show latest widgets
      .filter((w) =>
        page.widgets.find((a) => a.elementId === w.elementId) ? false : true
      );
  }

  function removeWidget(id) {
    page.widgets = page.widgets.filter((w) => w.elementId !== id);
    availableWidgets = loadWidgets();
  }

  let availableWidgets = loadWidgets();
</script>

<svelte:head>
  <link
    href="https://cdn.jsdelivr.net/npm/daisyui@2.15.4/dist/full.css"
    rel="stylesheet"
    type="text/css"
  />
  <script src="https://cdn.tailwindcss.com/3.1.3?plugins=typography"></script>
</svelte:head>

<Navbar />
<main class="container mx-auto">
  <section class="hero bg-base-100 min-h-screen items-start">
    <div class="hero-content flex-col">
      {#if error}
        <div class="alert alert-error">
          {error}
        </div>
      {/if}
      <form class="w-full" on:submit|preventDefault={submit}>
        <div class="form-control">
          <label for="content" class="label"
            >Page Content <span class="text-sm"
              >(use the markdown language or html to add content your page)</span
            ></label
          >
          <textarea
            class="textarea textarea-bordered textarea-secondary bg-white"
            id="content"
            name="content"
            bind:value={page.content}
          />
        </div>
        <button
          type="button"
          class="btn btn-ghost my-16"
          on:click={() => (advanced = !advanced)}>Show Advanced Options</button>

        {#if advanced}
          <div class="mt-4 form-control">
            <label for="profile" class="label cursor-pointer">
              <div>
                <span class="label-text text-xl">Add Profile</span>
                <br />
                <span class="text-sm"
                  >toggle on to include your profile as the web page header.</span
                >
              </div>

              <input
                type="checkbox"
                class="toggle toggle-secondary"
                bind:checked={page.profile}
              />
            </label>
          </div>
          <div class="mt-4 form-control">
            <label for="gallery" class="label cursor-pointer">
              <div>
                <span class="label-text text-xl">NFT Gallery</span>
                <br />
                <span class="hidden md:inline-block text-sm"
                  >Enter Ethereum Wallet Address</span
                >
              </div>
              <input
                type="input"
                class="input input-bordered w-1/2"
                bind:value={page.ethwallet}
              />
            </label>
          </div>
          <div class="my-8 form-control">
            <label class="label">
              <div>
                <span class="label-text text-xl">Select Theme</span>
                <br />
                <span class="hidden md:inline-block text-sm"
                  >Select a fun theme for your page, by default, the `light`
                  theme is chosen unless browser is set to dark mode, then the
                  `dark` theme is chosen.</span
                >
              </div>
              <select
                id="theme-select"
                class="select select-bordered"
                bind:value={page.theme}
              >
                <option value="default">default</option>
                {#each themes as theme}
                  <option value={theme}>{theme}</option>
                {/each}
              </select>
            </label>
          </div>
          <div class="mt-4 form-control">
            <label for="footer" class="label cursor-pointer">
              <div>
                <span class="label-text text-xl">Allow Stamps</span>
                <br />
                <span class="text-sm">toggle off to not receive stamps</span>
              </div>
              <input
                type="checkbox"
                class="toggle toggle-secondary"
                bind:checked={page.allowStamps}
              />
            </label>
          </div>
          <div class="mt-4 form-control">
            <label for="footer" class="label cursor-pointer">
              <div>
                <span class="label-text text-xl">Footer</span>
                <br />
                <span class="text-sm">toggle off to not include footer</span>
              </div>
              <input
                type="checkbox"
                class="toggle toggle-secondary"
                bind:checked={page.includeFooter}
              />
            </label>
          </div>

          <div class="my-8 form-control">
            <label class="label">
              <span class="label-text text-xl">Widgets</span>
              <br />
              <span class="hidden md:inline-block text-sm"
                >Add widgets to permapages to add interactive functionality to
                your page.</span
              >
              <button
                type="button"
                class="btn btn-secondary"
                on:click={() => (widgetDialog = true)}>Add Widget</button
              >
            </label>
          </div>
          {#if page.widgets.length > 0}
            <div class="flex space-x-4 mb-8">
              {#each page.widgets as w}
                <div
                  class="badge badge-primary"
                  on:click={removeWidget(w.elementId)}
                >
                  {w.name} - {w.version || "v0.0.6"}
                </div>
              {/each}
            </div>
          {/if}
        {/if}

        <div class="mt-4 alert alert-info flex flex-col space-y-8 py-8">
          <div class="text-xl font-bold">Want a subdomain? Check out ArNS</div>
          <p>
            When you publish a page, it will be posted on the permaweb, once
            published you can attach a registered subdomain using ArNS
            https://[subdomain].arweave.dev. Want to learn more about ArNS
          </p>
          <a class="link" href="https://ar.io/arns">Click here to learn more.</a
          >
        </div>
        <div class="mt-8 flex justify-end space-x-2">
          <!--
          <button type="button" class="btn btn-secondary" on:click={preview}
            >Preview</button
          >
          -->
          <button type="submit" class="btn btn-primary">Publish</button>
          <a class="btn" href="/pages" on:click={() => easymde.value("")}
            >Cancel</a
          >
        </div>
      </form>
    </div>
  </section>
</main>
