<script>
  import { meta } from "tinro";
  import Navbar from "../components/navbar.svelte";
  import Modal from "../components/modal.svelte";
  import { account, address } from "../store.js";
  import { publish } from "../services/assets.js";
  import { posts } from "../app.js";
  import markdownIt from "markdown-it";
  import container from "markdown-it-container";
  import attrs from "markdown-it-attrs";
  import { onMount } from "svelte";
  import Copyright from "../widgets/copyright.svelte";

  var easymde = null;
  let error = null;
  let confirm = false;

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
      previewRender: (txt) => md.render(txt),
      //previewClass: "prose md:prose-lg lg:prose-xl m-8 md:mx-24",
    });
    // if (!meta().query.fork) {
    //   easymde.value = "";
    //   page.content = "";
    // }
  });

  let post = {
    title: "",
    description: "",
    content: "",
    topic: "",
    owner: $address,
  };

  async function submit() {
    const { create } = posts({ publish, md });
    post.content = easymde.value();
    post.profile = $account.profile;

    const result = await create(post).toPromise();
    console.log(result);
  }
</script>

<Navbar />
<main class="container mx-auto">
  <section class="hero bg-base-100 min-h-screen items-start">
    <div class="hero-content flex-col w-full">
      <div class="flex items-start w-full">
        <a
          href="/#/pages/posts"
          class="btn rounded-full bg-[#F9F9F9] min-h-[2.5rem] h-[2.5rem] px-8 hover:bg-gray-200 border-none"
        >
          <img src="polygon-icon.svg" alt="polygon-icon" />
          <span class="text-[#696969] ml-4">Back</span>
        </a>
      </div>

      {#if error}
        <div class="alert alert-error">
          {error}
        </div>
      {/if}

      <div class="w-full flex flex-row items-center justify-between mt-10">
        {#if $account && $account.profile}
          <div class="w-1/2 flex flex-row items-center">
            <img
              class="mask mask-circle h-[48px] w-[48px]"
              src={$account.profile.avatar}
              alt={$account.profile.name}
            />
            <div class="ml-4">
              <h3 class="flex flex-row items-center text-lg font-bold">
                <span>{$account.profile.name}</span>
                <a
                  href="https://twitter.com/{$account.profile.links.twitter}"
                  class="inline-block ml-2"
                  ><img src="twitter.svg" alt="twitter" /></a
                >
              </h3>
              <p>{$account.profile.bio}</p>
            </div>
          </div>
        {/if}

        <div class="w-1/4 flex flex-row items-center justify-end">
          <p class="text-[#7D7D7D]">Edit in full screen mode</p>
          <button
            class="ml-4 btn m-0 bg-transparent hover:bg-transparent border-none"
          >
            <img src="full-screen.svg" alt="full-screen" />
          </button>
        </div>
      </div>

      <form class="w-full" on:submit|preventDefault={submit}>
        <!--
        <div class="flex items-center gap-2 mt-4">
          <button type="button"
            ><img src="arrow-down.svg" alt="arrow-down" width="20px" /></button
          >
          <span class="font-semibold">only.arweave.dev/blog</span>
        </div>
        -->
        <div class="form-control w-full mt-4">
          <label for="title" class="label font-semibold">Title</label>

          <input
            type="text"
            class="input input-bordered w-full"
            id="title"
            bind:value={post.title}
            placeholder="Enter Title of your post (max: 50 characters)"
          />
        </div>

        <div class="form-control w-full mt-4">
          <label for="description" class="label font-semibold"
            >Description</label
          >

          <input
            type="text"
            class="input input-bordered w-full"
            id="description"
            bind:value={post.description}
            placeholder="Enter a 150 character description of your post"
          />
        </div>

        <div class="form-control w-full mt-4">
          <label for="content" class="label font-semibold">
            Content(markdown)
          </label>

          <textarea
            class="textarea textarea-bordered textarea-secondary bg-white"
            id="content"
            name="content"
            bind:value={post.content}
          />
        </div>

        <div class="form-control w-full mt-4">
          <label for="topic" class="label font-semibold">Topics</label>

          <input
            type="text"
            class="input input-bordered w-full"
            id="topic"
            bind:value={post.topic}
            placeholder="(optional) Enter a topic of your post."
          />
        </div>

        <!--
        <div
          class="form-control w-full flex flex-row items-center justify-between mt-4"
        >
          <label for="public" class="label font-semibold cursor-pointer"
            >Public (if marked public the post will be unencrypted and viewable
            by everyone.)</label
          >

          <input
            type="checkbox"
            class="toggle toggle-secondary"
            id="public"
            bind:value={page.public}
            placeholder="Enter Title of your note (max: 20 characters)"
          />
        </div>
        -->
        <button
          type="submit"
          class="group gradient inline-block bg-gradient-to-r from-[#FF00E5] to-[#7B55EC] mt-4 btn p-[2px] min-h-[2.5rem] h-[2.5rem] 
          hover:bg-[#7B55EC] border-none"
        >
          <div
            class="w-full h-full px-10 py-3 bg-white inline-block rounded-full group-hover:bg-gradient-to-r group-hover:to-[#7B55EC]
           group-hover:from-[#FF00E5]"
          >
            <div class="txt-gradient inline-block group-hover:text-white">
              Publish
            </div>
          </div>
        </button>

        <p class="mt-4 text-[7D7D7D] text-sm">
          $0.00 cost to upload this permanently on Arweave.
        </p>
      </form>
    </div>
  </section>

  <Copyright />
</main>

<Modal open={confirm} ok={false}>
  <p>
    This will be published on the permaweb and cannot be removed. If you choose
    to keep it private it will be encrypted by your wallet. <br /><br />

    Your connected
    <span class="inline-flex items-center">
      <span class="mr-2 font-semibold">Matic</span>
      <button><img src="arrow-down.svg" alt="arrow-down" width="20px" /></button
      >
    </span>
    wallet will be charged <b>{0.005}</b> MATIC for this blog post.
  </p>

  <div class="w-full flex flex-col justify-start mt-4">
    <!--
    <button
      class="gradient inline-block bg-gradient-to-r from-[#FF00E5] to-[#7B55EC] mt-4 btn p-[2px] min-h-[2.5rem] h-[2.5rem] 
    hover:bg-[#7B55EC] border-none w-full hover:from-[#7B55EC] hover:to-[#FF00E5]"
    >
      Publish Permanently ({page.public ? "Public" : "Private"})
    </button>
-->
    <button
      class="btn p-[2px] min-h-[2.5rem] h-[2.5rem] border-none w-full bg-gray-300 mt-4 rounded-full
      drop-shadow-sm text-black hover:text-white"
      on:click={() => (confirm = false)}
    >
      Go Back
    </button>
  </div>
</Modal>

<style>
  .gradient {
    @apply drop-shadow-sm rounded-full;
  }
  .gradient:hover {
    @apply p-[2px] drop-shadow-md;
  }
</style>
