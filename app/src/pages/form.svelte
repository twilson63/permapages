<script>
  import { router, meta } from "tinro";
  import Navbar from "../components/navbar.svelte";
  import Modal from "../components/modal.svelte";
  import postVanilla from "../services/vanilla.js";
  import {
    postPageTx,
    postWebpage,
    loadPage,
    loadProfile,
    loadState,
  } from "../services/arweave.js";
  import { gql } from "../services/gql.js";
  import { register, listANTs, updateSubDomain } from "../services/registry.js";
  import { pages, profiles, widgets } from "../app.js";
  import { address, pageCache } from "../store.js";
  import markdownIt from "markdown-it";
  import container from "markdown-it-container";
  import attrs from "markdown-it-attrs";
  import hljs from "highlight.js";
  import opensea from "../widgets/opensea.js";
  import Mustache from "mustache";
  import { onMount } from "svelte";
  import compose from "ramda/src/compose";
  import append from "ramda/src/append";
  import mergeAll from "ramda/src/mergeAll";
  import join from "ramda/src/join";
  import split from "ramda/src/split";
  import toLower from "ramda/src/toLower";
  import find from "ramda/src/find";
  import propEq from "ramda/src/propEq";
  import trim from "ramda/src/trim";

  let advanced = false;
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
  let topics = "";

  let updateSubdomain = false;

  let profileWidgetUrl = "https://profile-widget.arweave.dev";

  let allWidgets = [];
  let ant = null;

  let lastTx = meta().query.fork;

  let themes = [
    "corporate",
    "cupcake",
    "bumblebee",
    "emerald",
    "halloween",
    "garden",
    "forest",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "winter",
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
      indentWithTabs: false,
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
    units: 100,
    theme: "corporate",
    license: "IVjAM1C3x3GFdc3t9EqMnbtGnpgTuJbaiYZa1lk09_8",
    derivation: false,
    derivationValue: "",
    derivationValuePlus: "1",
    commercial: false,
    commercialValue: "",
    commercialValuePlus: "1",
    dataModelTraining: false,
    dataModelTrainingValue: "",
    dataModelTrainingValuePlus: "1",
  };

  if (meta().query.fork) {
    // getNote from meta().query.fork
    pages({ load: loadPage, loadState })
      .get(meta().query.fork)
      .then(async (p) => {
        topics = p.topics ? p.topics.join(", ") : "";
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
        page.theme = p.theme || "light";
        page.widgets = p.widgets || [];
        page.includeFooter = p.includeFooter || false;
        page.allowStamps = p.allowStamps || false;
        page.noContract = p.noContract || false;
        page.noBundlr = p.noBundlr || false;
        page.license =
          p.license || "IVjAM1C3x3GFdc3t9EqMnbtGnpgTuJbaiYZa1lk09_8";

        page.derivation = p.derivation || false;
        page.derivationValue = p.derivationValue;
        page.derivationValuePlus = p.derivationValuePlus || "1";

        page.commercial = p.commercial || false;
        page.commercialValue = p.commercialValue;
        page.commercialValuePlus = p.commercialValuePlus || "1";

        page.dataModelTraining = p.dataModelTraining || false;
        page.dataModelTrainingValue = p.dataModelTrainingValue;
        page.dataModelTrainingValuePlus = p.dataModelTrainingValuePlus || "1";

        page.state = mergeAll(
          {
            ticker: "PAGE",
            name: p.title,
            title: p.title,
            description: p.description,
            creator: p.owner || p.creator,
            balances: {
              [$address]: p.units,
            },
            contentType: "text/html",
            createdAt: Date.now(),
            claimable: [],
            settings: [["isTradeable", true]],
          },
          p.state
        );
      });
  } else {
  }

  async function submit() {
    confirm = true;
  }

  async function doConfirm() {
    let widgetMarkup = "";
    try {
      confirm = false;
      submitting = true;

      page.content = easymde.value();
      page.creator = $address;
      page.units = Number(page.units);
      // allowStamps is set
      if (page.allowStamps) {
        //if (!find(propEq("elementId", "passport"), page.widgets)) {
        page.widgets = [
          ...page.widgets.filter((w) => w.elementId !== "passport"),
          {
            source: "https://stamp-widget.arweave.dev",
            elementId: "passport",
            name: "passport",
            description: "Permapage Passport Widget",
            version: "latest",
          },
        ];
        // }
      } else {
        page.widgets = page.widgets.filter((w) => w.elementId !== "passport");
      }

      // upgrade current page widgets
      // if (allWidgets.length > 0) {
      //   page.widgets = page.widgets.map((w) => {
      //     return allWidgets.find(
      //       (_widget) => _widget.elementId === w.elementId
      //     );
      //   });
      // }

      // handle widgets
      if (page.widgets) {
        widgetMarkup = page.widgets.reduce((a, w) => {
          if (w.name === "passport") {
            return (
              a +
              `<li><div id="${w.name}" class="w-full grid items-center mt-16 mx-auto"></div></li>`
            );
          } else {
            return a + `<li><div id="${w.name}"></div></li>`;
          }
        }, "");
      }

      let altText = "";
      if (page.theme === "default") {
        altText =
          "dark:text-[#D3D7E0] dark:prose-headings:text-[#D3D7E0] dark:prose-headings:text-[#D3D7E0]";
      }
      page.html = `<div class="drawer drawer-end">
<input id="drawer" type="checkbox" class="drawer-toggle" />
<div class="drawer-content">
  <div class="md:min-h-screen">
  ${
    page.widgets.length > 0
      ? `
    <div class="float-right">
      <label for="drawer" class="btn btn-primary btn-outline drawer-button mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </label>
    </div>`
      : ""
  }
  
  <div class="prose md:prose-lg lg:prose-xl m-8 md:mx-24 ${altText} max-w-full">
    ${md.render(page.content)}
  </div>
  </div>
</div>
<div class="drawer-side">
  <label for="drawer" class="drawer-overlay"></label>
  <ul class="menu p-4 w-80 bg-base-100 text-base-content">
    <li>
      <div class="float-right">
        <label for="drawer" class="btn btn-block btn-outline drawer-button">CLOSE</label>
      </div>
      <h3 class="text-2xl">Widgets</h3>
    </li>
    ${widgetMarkup}
  </ul>
</div>
</div>`;

      // page.html = `<div class="flex flex-col ${
      //   page.widgets.length > 0 ? "md:flex-row" : ""
      // } space-x-4">
      //   <div class="flex-1 md:min-h-screen">
      //     <div class="prose md:prose-lg lg:prose-xl m-8 md:mx-24 ${altText} ${
      //   page.widgets.length > 0 ? "" : "max-w-full"
      // } ">
      //     ${md.render(page.content)}</div></div>
      //   <div class="flex-none">
      //     <div class="flex flex-col max-w-[300px] justify-end space-y-8">
      //       ${widgetMarkup}
      //     </div>
      //   </div
      // </div>
      // `;

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

      page.topics = topics.split(",").map((t) => trim(t));

      // if noBundlr and noContract then handle
      let result;
      if (page.noBundlr && page.noContract) {
        result = await pages({
          postVanilla,
        }).createVanilla(page, (m) => (step = m.step));
      } else {
        result = await pages({
          postWebpage,
        }).create(page);
      }

      $pageCache = [
        {
          id: result,
          title: page.title,
          type: page.type,
          owner: page.creator,
          status: null,
          timestamp: Date.now(),
          protocol: page.protocol,
        },
        ...$pageCache,
      ];

      // if (updateSubdomain) {
      //   const updateResult = await updateSubDomain({
      //     ant: ant,
      //     subdomain: "@",
      //     transactionId: result.webpage,
      //   });
      // }

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
      errorMessage = e.message;
      errorDialog = true;
      window.scrollTo(0, 0);
    }
  }

  async function getnfts(wallet) {
    const results = await fetch(
      "https://api.opensea.io/api/v1/assets?owner=" + wallet
    ).then((res) => res.json());

    return results.assets;
  }

  async function preview() {
    let html = md.render(easymde.value());
    html = `<div class="prose-lg m-16" ${
      page.theme === "default" ? "" : ` data-theme="${page.theme}"`
    }>${html}</div>`;
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
    const ws = await widgets({ gql }).list();

    return ws
      .filter(
        (w) =>
          !["widget-connector", "widget-poap", "widget-stamp"].includes(w.name)
      )
      .reduce((a, v) => (find(propEq(v.name, "name"), a) ? a : [...a, v]), []) // only show latest widgets
      .filter((w) =>
        page.widgets.find((a) => a.elementId === w.elementId) ? false : true
      );
  }

  function addWidget(w) {
    try {
      page.widgets = append(w, page.widgets);
      availableWidgets = loadWidgets();
    } catch (e) {
      console.log("ERROR", e);
    }
  }

  function removeWidget(id) {
    page.widgets = page.widgets.filter((w) => w.elementId !== id);
    availableWidgets = loadWidgets();
  }

  let availableWidgets = loadWidgets();
</script>

<Navbar />
<main>
  <section class="hero bg-base-100 min-h-screen items-start w-full">
    <div class="hero-content flex-col w-full">
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
          on:click={() => (advanced = !advanced)}>Show Advanced Options</button
        >
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
              <div class="flex space-x-2">
                <input
                  type="checkbox"
                  class="toggle toggle-secondary"
                  bind:checked={page.profile}
                />
                <div class="font-mono text-gray-400">
                  {page.profile ? "ON" : "OFF"}
                </div>
              </div>
            </label>
          </div>
          <div class="mt-4 form-control">
            <label for="gallery" class="label cursor-pointer">
              <div>
                <span class="label-text text-xl">Atomic Asset Units</span>
                <br />
                <span class="hidden md:inline-block text-sm"
                  >Enter the number of units for trading this Atomic Asset</span
                >
              </div>
              <input
                type="input"
                class="input input-bordered w-1/2"
                bind:value={page.units}
              />
            </label>
          </div>
          <!-- License Info -->
          <div class="mt-4 form-control">
            <label for="gallery" class="label cursor-pointer">
              <div>
                <span class="label-text text-xl">License</span>
                <br />
                <span class="hidden md:inline-block text-sm">TX of License</span
                >
              </div>
              <input
                type="input"
                class="input input-bordered w-1/2"
                bind:value={page.license}
              />
            </label>
          </div>
          <div class="mt-4 form-control">
            <label for="profile" class="label cursor-pointer">
              <div>
                <span class="label-text text-xl">Allow Derived Works</span>
                <br />
                <span class="text-sm">toggle on to allow for derived works</span
                >
              </div>

              {#if page.derivation}
                <select
                  class="select select-bordered w-[300px]"
                  bind:value={page.derivationValue}
                >
                  <option>select</option>
                  <option value="Allowed">Allowed</option>
                  <option value="Allowed-With-Credit"
                    >Allowed with Credit</option
                  >
                  <option value="Allowed-With-Indication"
                    >Allowed with Indication</option
                  >
                  <option value="Allowed-With-License-Passthrough"
                    >Allowed with license passthrough</option
                  >
                  <option value="Allowed-With-RevenueShare"
                    >Allowed with Revenue Share</option
                  >
                  <option value="Allowed-With-Fee-One-Time"
                    >Allowed with One Time Fee</option
                  >
                  <option value="Allowed-With-Fee-Monthly"
                    >Allowed with Monthly Fee</option
                  >
                </select>
                {#if ["Allowed-With-RevenueShare", "Allowed-With-Fee-One-Time", "Allowed-With-Fee-Monthly"].includes(page.derivationValue)}
                  <input
                    type="input"
                    class="input input-bordered w-[100px]"
                    bind:value={page.derivationValuePlus}
                  />
                {/if}
              {/if}
              <div class="flex space-x-2">
                <input
                  type="checkbox"
                  class="toggle toggle-secondary"
                  bind:checked={page.derivation}
                />
                <div class="font-mono text-gray-400">
                  {page.derivation ? "ON" : "OFF"}
                </div>
              </div>
            </label>
          </div>

          <div class="mt-4 form-control">
            <label for="profile" class="label cursor-pointer">
              <div>
                <span class="label-text text-xl">Allow Commercial Use</span>
                <br />
                <span class="text-sm"
                  >toggle on to allow for Commercial Use</span
                >
              </div>

              {#if page.commercial}
                <select
                  class="select select-bordered w-[300px]"
                  bind:value={page.commercialValue}
                >
                  <option>select</option>
                  <option value="Allowed">Allowed</option>
                  <option value="Allowed-With-Credit"
                    >Allowed with Credit</option
                  >
                  <option value="Allowed-With-RevenueShare"
                    >Allowed with Revenue Share</option
                  >
                  <option value="Allowed-With-Fee-One-Time"
                    >Allowed with One Time Fee</option
                  >
                  <option value="Allowed-With-Fee-Monthly"
                    >Allowed with Monthly Fee</option
                  >
                </select>
                {#if ["Allowed-With-RevenueShare", "Allowed-With-Fee-One-Time", "Allowed-With-Fee-Monthly"].includes(page.commercialValue)}
                  <input
                    type="input"
                    class="input input-bordered w-[100px]"
                    bind:value={page.commercialValuePlus}
                  />
                {/if}
              {/if}
              <div class="flex space-x-2">
                <input
                  type="checkbox"
                  class="toggle toggle-secondary"
                  bind:checked={page.commercial}
                />
                <div class="font-mono text-gray-400">
                  {page.commercial ? "ON" : "OFF"}
                </div>
              </div>
            </label>
          </div>
          <div class="mt-4 form-control">
            <label for="profile" class="label cursor-pointer">
              <div>
                <span class="label-text text-xl">Allow Data Model Training</span
                >
                <br />
                <span class="text-sm"
                  >toggle on to allow for Data Model Training</span
                >
              </div>

              {#if page.dataModelTraining}
                <select
                  class="select select-bordered w-[300px]"
                  bind:value={page.dataModelTrainingValue}
                >
                  <option>select</option>
                  <option value="Allowed">Allowed</option>
                  <option value="Allowed-With-RevenueShare"
                    >Allowed with Revenue Share</option
                  >
                  <option value="Allowed-With-Fee-One-Time"
                    >Allowed with One Time Fee</option
                  >
                  <option value="Allowed-With-Fee-Monthly"
                    >Allowed with Monthly Fee</option
                  >
                </select>
                {#if ["Allowed-With-RevenueShare", "Allowed-With-Fee-One-Time", "Allowed-With-Fee-Monthly"].includes(page.dataModelTrainingValue)}
                  <input
                    type="input"
                    class="input input-bordered w-[100px]"
                    bind:value={page.dataModelTrainingValuePlus}
                  />
                {/if}
              {/if}
              <div class="flex space-x-2">
                <input
                  type="checkbox"
                  class="toggle toggle-secondary"
                  bind:checked={page.dataModelTraining}
                />
                <div class="font-mono text-gray-400">
                  {page.dataModelTraining ? "ON" : "OFF"}
                </div>
              </div>
            </label>
          </div>
          <!-- <div class="mt-4 form-control">
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
          </div> -->
          <div class="my-8 form-control">
            <label class="label">
              <div>
                <span class="label-text text-xl">Select Theme</span>
                <br />
                <span class="hidden md:inline-block text-sm"
                  >Select a fun theme for your page, by default, the `corporate`
                  theme is chosen.</span
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
              <div class="flex space-x-2">
                <input
                  type="checkbox"
                  class="toggle toggle-secondary"
                  bind:checked={page.allowStamps}
                />
                <div class="font-mono text-gray-400">
                  {page.allowStamps ? "ON" : "OFF"}
                </div>
              </div>
            </label>
          </div>

          <div class="mt-4 form-control">
            <label for="footer" class="label cursor-pointer">
              <div>
                <span class="label-text text-xl">Footer</span>
                <br />
                <span class="text-sm">toggle off to not include footer</span>
              </div>
              <div class="flex space-x-2">
                <input
                  type="checkbox"
                  class="toggle toggle-secondary"
                  bind:checked={page.includeFooter}
                />
                <div class="font-mono text-gray-400">
                  {page.includeFooter ? "ON" : "OFF"}
                </div>
              </div>
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
          <div class="mt-4 form-control">
            <label for="contract" class="label cursor-pointer">
              <div>
                <span class="label-text text-xl">Disable Contract</span>
                <br />
                <span class="text-sm">Deploy without contract</span>
              </div>
              <div class="flex space-x-2">
                <input
                  type="checkbox"
                  class="toggle toggle-secondary"
                  bind:checked={page.noContract}
                />
                <div class="font-mono text-gray-400">
                  {page.noContract ? "ON" : "OFF"}
                </div>
              </div>
            </label>
          </div>
          <div class="mt-4 form-control">
            <label for="dispatch-l1" class="label cursor-pointer">
              <div>
                <span class="label-text text-xl">Dispatch L1</span>
                <br />
                <span class="text-sm"
                  >Dispatch Page to Layer 1 ($AR is required!)</span
                >
              </div>
              <div class="flex space-x-2">
                <input
                  type="checkbox"
                  class="toggle toggle-secondary"
                  bind:checked={page.noBundlr}
                />
                <div class="font-mono text-gray-400">
                  {page.noBundlr ? "ON" : "OFF"}
                </div>
              </div>
            </label>
          </div>
        {/if}

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
          maxlength="150"
          bind:value={page.title}
          placeholder="Enter title of your page that will appear on the browser tab."
        />
        <small>(max: 150 characters)</small>
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
        <label for="topics" class="label">Topics</label>
        <input
          class="input input-bordered"
          id="topics"
          name="topics"
          bind:value={topics}
          placeholder="Create a list of topics separated by commas."
        />
        <small>(Create a list of topics separated by commas.)</small>
      </div>
      <!-- {#if ant}
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
      {/if} -->
      <div class="modal-action">
        <button for="confirm" class="btn">Submit</button>
      </div>
    </form>
  </div>
</div>
<Modal open={submitting} ok={false}>
  <h3 class="text-2xl">Creating Webpage!</h3>
  <ul class="steps steps-vertical">
    <li class="step {step === 1 ? 'step-primary' : ''}">Publishing Page</li>
    <!--
    <li class="step {step === 1 ? 'step-primary' : ''}">Generating Page</li>
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
<Modal open={widgetDialog} on:click={() => (widgetDialog = false)}>
  <h3 class="text-2xl mb-8">Widgets</h3>
  <div>
    {#await availableWidgets}
      <div>Loading...</div>
    {:then widgets}
      {#each widgets as widget}
        <div class="card">
          <div class="card-body">
            <div class="card-title">
              {widget.name}
              <span class="badge badge-primary">{widget.version}</span>
            </div>
            <div class="flex">
              <div class="flex-1">{widget.description}</div>
              <div class="flex-none">
                <a
                  class="btn btn-sm btn-info"
                  target="_blank"
                  href={widget.docs}>docs</a
                >
              </div>
            </div>
            <div class="card-actions">
              <button
                class="btn btn-sm btn-primary"
                on:click={() => addWidget(widget)}>Add Widget</button
              >
            </div>
          </div>
        </div>
      {:else}
        <div class="card">
          <div class="card-body">
            <div class="card-title">
              No more widgets available. Click OK to continue.
            </div>
          </div>
        </div>
      {/each}
    {/await}
  </div>
</Modal>
