<script>
  import { router, meta } from "tinro";
  import Navbar from "../components/navbar.svelte";
  import Modal from "../components/modal.svelte";
  import {
    postPageTx,
    postWebpage,
    loadPage,
    loadProfile,
    gql,
  } from "../services/arweave.js";
  import { register, listANTs, updateSubDomain } from "../services/registry.js";
  import { pages, profiles, widgets } from "../app.js";
  import { address, pageCache } from "../store.js";
  import { marked } from "marked";
  import opensea from "../widgets/opensea.js";
  import Mustache from "mustache";
  import { onMount } from "svelte";
  import compose from "ramda/src/compose";
  import pluck from "ramda/src/pluck";
  import append from "ramda/src/append";

  var easymde = null;
  let error = null;
  let submitting = false;
  let confirm = false;
  let step = 0;
  let frame;
  let frameDialog = false;
  let errorDialog = false;
  let errorMessage = "";
  let widgetDialog = false;

  let updateSubdomain = false;

  let profileWidgetUrl = "https://profile-widget.arweave.dev";

  let ant = null;
  let lastTx = meta().query.fork;

  let themes = [
    "synthwave", "retro", "cyberpunk", "valentine", "aqua", "night", "coffee"
  ]

  onMount(async () => {
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
    });
    // if (!meta().query.fork) {
    //   easymde.value = "";
    //   page.content = "";
    // }
    const ants = await listANTs($address);
    const txs = compose(pluck("@"), pluck("records"))(ants);
    ant = ants[txs.indexOf(page.webpage)];
  });

  let page = { public: true, widgets: [], includeFooter: true };

  if (meta().query.fork) {
    // getNote from meta().query.fork
    pages({ load: loadPage })
      .get(meta().query.fork)
      .then((p) => {
        page.title = p.title;
        page.description = p.description;
        page.subdomain = p.subdomain;
        easymde.value(p.content);
        page.content = p.content;
        page.profile = p.profile;
        page.ethwallet = p.ethwallet;
        page.webpage = p.webpage;
        page.theme = p.theme;
        page.widgets = p.widgets;
        page.includeFooter = p.includeFooter || true;
      });
  } else {
  }

  async function submit() {
    confirm = true;
  }

  async function doConfirm() {
    let widgetMarkup = ''
    try {
      confirm = false;
      submitting = true;

      page.content = easymde.value();
      page.owner = $address;

      // handle widgets
      if (page.widgets) {
        widgetMarkup = page.widgets.reduce((a,w) => a + `<div id="${w.name}"></div>`, '')
      }

      page.html = `<div class="flex space-x-4">  
        <div class="prose prose-lg m-8 md:m-24 flex-1">${marked.parse(page.content)}</div>
        <div class="flex-none">
          <div class="flex flex-col space-y-8">
            ${widgetMarkup}
          </div>
        </div
      </div>
      `;

      if (page.ethwallet) {
        const data = await opensea.code.preRender({ address: page.ethwallet });
        page.html =
          Mustache.render(opensea.template(), data) + "\n" + page.html;
      }

      if (page.profile) {
        let profileData = await profiles({ gql, load: loadProfile }).get(
          $address
        );

        const profileWidget = Mustache.render(profileTemplate(), profileData);

        page.html = profileWidget + "\n" + page.html;
      }

      const result = await pages({
        register,
        post: postPageTx,
        postWebpage,
      }).create(page, (m) => {
        step = m.step;
      });

      $pageCache = [result, ...$pageCache];

      if (updateSubdomain) {
        console.log("ANT", ant.id);
        console.log("result", result.id);
        //await updateSubDomain(ant.id, result.id);
      }
      submitting = false;

      if (!result.foundPost) {
        window.scrollTo(0, 0);
        router.goto("/pages");
      } else {
        window.scrollTo(0, 0);
        router.goto("/pages");
      }
    } catch (e) {
      submitting = false;
      console.log(e);
      errorMessage = e.message;
      errorDialog = true;
      window.scrollTo(0, 0);
    }
  }

  async function getnfts(wallet) {
    const results = await fetch(
      "https://api.opensea.io/api/v1/assets?owner=" + wallet
    ).then((res) => res.json());
    console.log(results);
    return results.assets;
  }

  async function preview() {
    let html = marked.parse(easymde.value());
    html = `<div class="prose-lg m-16" ${page.theme === 'default' ? '' : ` data-theme="${page.theme}"`}>${html}</div>`;
    // if (page.ethwallet) {
    //   const data = await opensea.code.preRender({ address: page.ethwallet });
    //   html = Mustache.render(opensea.template(), data) + "\n" + html;
    // }

    // if (page.profile) {
    //   let profileData = $account.profile;
    //   if (page.weavemail) {
    //     profileData = { ...profileData, weavemail: profileData.addr };
    //   }
    //   const profileWidget = Mustache.render(profileTemplate(), profileData);
    //   html = profileWidget + "\n" + html;
    // }
    localStorage.setItem("html", html);
    window.scrollTo(0, 0);
    frameDialog = true;
  }

  function profileTemplate() {
    return (
      `<div id="profile" data-addr="{{owner}}"></div>` +
      `<script src="${profileWidgetUrl}">` +
      "<//script>".replace("/", "")
    );
  }

  async function loadWidgets() {
    const ws = await widgets({gql}).list()
    return ws.filter(w => 
      page.widgets.find(a => a.elementId === w.elementId) ? false : true
    )

  }

  function addWidget(w) {
    page.widgets = append(w, page.widgets)
    availableWidets = loadWidgets()
  }

  function removeWidget(id) {
    page.widgets = page.widgets.filter(w => w.elementId !== id) 
    availableWidets = loadWidgets()
  }

  let availableWidets = loadWidgets()
</script>

<Navbar />
<main>
  <section class="hero bg-base-100 min-h-screen items-start">
    <div class="hero-content flex-col">
      {#if error}
        <div class="alert alert-error">
          {error}
        </div>
      {/if}
      <h1 class="text-2xl">Create Permapage</h1>
      <form class="w-full" on:submit|preventDefault={submit}>
        <div class="mt-4 form-control">
          <label for="profile" class="label cursor-pointer">
            <span class="label-text text-xl"
              >Profile (if marked the page will insert your account as a header
              to the page.)</span
            >
            <input
              type="checkbox"
              class="toggle toggle-secondary"
              bind:checked={page.profile}
            />
          </label>
        </div>
        <div class="mt-4 form-control">
          <label for="gallery" class="label cursor-pointer">
            <span class="label-text text-xl"
              >NFT Gallery</span
            >
            <small class="hidden md:inline-block">Enter Ethereum Wallet Address</small>
            <input
              type="input"
              class="input input-bordered w-1/2"
              bind:value={page.ethwallet}
            />
          </label>
        </div>
        <div class="my-8 form-control">
          <label class="label">
            <span class="label-text text-xl">Select Theme</span>
            <small class="hidden md:inline-block">Select a fun theme for your page, by default, the `light` theme is chosen unless browser is set to dark mode, then the `dark` theme is chosen.</small>
            <select id="theme-select" class="select select-bordered" bind:value={page.theme}>
              <option value="default">default</option>
              {#each themes as theme}
                <option value={theme}>{theme}</option>
              {/each}
            </select>
            
          </label>
          
        </div>
        
        <div class="my-8 form-control">
          <label class="label">
            <span class="label-text text-xl">Widgets</span>
            <small class="hidden md:inline-block">Add widgets to permapages to add interactive functionality to your page.</small>
            <button type="button" class="btn btn-secondary" on:click={() => widgetDialog = true}>Add Widget</button>
          </label>
          
        </div>
        {#if page.widgets.length > 0}
          <div class="flex space-x-4 mb-8">
            {#each page.widgets as w}
            <div class="badge badge-primary" on:click={removeWidget(w.elementId)}>{w.name}</div>
            {/each}
          </div>
        {/if}
        
        <div class="mt-4 form-control">
          <label for="footer" class="label cursor-pointer">
            <span class="label-text text-xl"
              >Footer (toggle off to not include footer)</span
            >
            <input
              type="checkbox"
              class="toggle toggle-secondary"
              bind:checked={page.includeFooter}
            />
          </label>
        </div>
        <div class="form-control">
          <label for="content" class="label">Page Content(markdown)</label>
          <textarea
            class="textarea textarea-bordered textarea-secondary bg-white"
            id="content"
            name="content"
            bind:value={page.content}
          />
        </div>

        <p class="mt-4 alert alert-info">
          When you create a page, it will be posted on the permaweb, and can
          never be removed, once published you register a subdomain on ArNS
          https://[subdomain].arweave.net. <a
            target="_blank"
            class="btn btn-ghost"
            href="https://ar.io/arns">Learn more about ArNS</a
          >
        </p>
        <div class="mt-8">
          <!--
          <button type="button" class="btn btn-secondary" on:click={preview}
            >Preview</button
          >
          -->
          <button type="submit" class="btn btn-primary">Publish</button>
          <a class="btn" href="/pages">Cancel</a>
        </div>
      </form>
    </div>
  </section>
</main>

<input
  type="checkbox"
  id="confirm"
  bind:checked={confirm}
  class="modal-toggle"
/>
<div class="modal">
  <div class="modal-box w-full relative">
    <label for="confirm" class="btn btn-sm btn-circle absolute right-2 top-2"
      >x</label
    >
    <h3 class="font-bold text-lg">Complete Permapage</h3>
    <form class="w-full space-y-8" on:submit|preventDefault={doConfirm}>
      <div class="form-control">
        <label for="title" class="label">Title</label>
        <input
          required
          class="input input-bordered"
          id="title"
          name="title"
          maxlength="20"
          bind:value={page.title}
          placeholder="Enter title of your page that will appear on the browser tab."
        />
        <small>(max: 20 characters)</small>
      </div>
      <div class="form-control">
        <label for="description" class="label">Description</label>
        <textarea
          required
          class="textarea textarea-bordered"
          id="description"
          name="description"
          maxlength="150"
          bind:value={page.description}
          placeholder="Enter a description of your page. This will appear in the meta data of your page for social networks and search engines"
        />
        <small>(max: 150 characters)</small>
      </div>
      <div class="form-control">
        <label for="status" class="label">Status</label>
        <textarea
          class="textarea textarea-bordered"
          id="status"
          name="status"
          maxlength="150"
          bind:value={page.status}
          placeholder="Enter a status message about this update. ie (First Publish, adding new widget, etc)"
        />
        <small>(OPTIONAL, max: 150 characters)</small>
      </div>
      {#if ant}
        <div class="form-control">
          <label class="label">
            <input
              type="checkbox"
              class="checkbox"
              bind:checked={updateSubdomain}
            />
            <span>Update Arweave Subdomain</span>
          </label>
        </div>
      {/if}
      <div class="modal-action">
        <button for="confirm" class="btn">Submit</button>
      </div>
    </form>
  </div>
</div>
<Modal open={submitting}>
  <h3 class="text-2xl">Creating Webpage!</h3>
  <ul class="steps steps-vertical">
    <li class="step {step === 1 ? 'step-primary' : ''}">Generating Page</li>
    <li class="step {step === 2 ? 'step-primary' : ''}">Publishing Page</li>
    <!--
    <li class="step {step === 3 ? 'step-primary' : ''}">Saving Source</li>
    -->
  </ul>
</Modal>
{#if frameDialog}
  <div class="absolute inset-0 p-8 bg-base-100">
    <div class="flex mb-16">
      <h3 class="text-lg flex-1">Preview Permapage</h3>
      <div class="flex-0 flex justify-end space-x-4">
        <button class="btn" on:click={() => (frameDialog = false)}
          >Close Preview</button
        >
      </div>
    </div>

    <div class="mockup-window border border-base-300">
      <iframe
        bind:this={frame}
        class="w-full m-8"
        style="height: 1000px;"
        src="/#/preview"
        title="preview"
      />
    </div>
  </div>
{/if}
<Modal open={errorDialog}>
  <h3 class="text-2xl text-error">Error</h3>
  <p class="my-4">{errorMessage}</p>
</Modal>
<Modal open={widgetDialog} on:click={() => widgetDialog = false}>
  <h3 class="text-2x mb-8">Widgets</h3>
  <div>
    {#await availableWidets}
      <div>Loading...</div>
    {:then widgets}
      {#each widgets as widget}
      <div class="card">
        <div class="card-body">
          <div class="card-title">
            {widget.name} 
            <span class="badge badge-primary">{widget.version}</span>
          </div>
          <div>{widget.description}</div>
          <div class="card-actions">
            <button class="btn btn-sm" on:click={() => addWidget(widget)}>Add Widget</button>
          </div>
        </div>
        
      </div>
      {/each}
    {/await}
  </div>
</Modal>