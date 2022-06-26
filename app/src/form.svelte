<script>
  import { router, meta } from "tinro";
  import Navbar from "./components/navbar.svelte";
  import { arweave, postTx, waitfor, load } from "./services/arweave.js";
  import { init as initLikes } from "./services/likes.js";
  import { Jumper } from "svelte-loading-spinners";
  import { notes } from "./app.js";
  import { address, cache } from "./store.js";

  //import EasyMDE from "easymde";
  import { onMount } from "svelte";

  var easymde = null;
  let error = null;
  let submitting = false;
  let congestion = false;

  onMount(() => {
    easymde = new window.EasyMDE({
      autosave: {
        enabled: true,
        uniqueId: "new-permanote",
      },
      previewClass: "bg-base-200 p-4 prose prose-lg",
      spellChecker: false,
      nativeSpellcheck: false,
      //inputStyle: "contenteditable",
      //forceSync: true,
    });
  });

  let note = { public: false };

  if (meta().query.fork) {
    // getNote from meta().query.fork
    notes({ load })
      .get(meta().query.fork)
      .then((n) => {
        note.title = n.title;
        note.description = n.description;
        easymde.value(n.content);
        note.content = n.content;
        note.topic = n.topic;
        note.public = n.public;
      });
  }

  async function submit() {
    try {
      submitting = true;

      note.content = easymde.value();
      note.owner = $address;

      const likes = initLikes(arweave);
      const result = await notes({ post: postTx, waitfor, likes }).create(note);
      note.id = result.id;
      submitting = false;

      if (!result.foundPost) {
        note.cached = true;
        $cache = [note, ...($cache || [])];
        window.scrollTo(0, 0);
        router.goto("/notes");
        //congestion = true;
      } else {
        window.scrollTo(0, 0);
        router.goto("/notes");
      }
    } catch (e) {
      window.scrollTo(0, 0);
      error = e.message;
      submitting = false;
    }
  }
</script>

<Navbar />
<main>
  <section class="hero bg-base-100 min-h-screen">
    <div class="hero-content flex-col">
      {#if error}
        <div class="alert alert-error">
          {error}
        </div>
      {/if}
      <form class="w-full" on:submit|preventDefault={submit}>
        <div class="form-control">
          <label for="title" class="label">Title</label>
          <input
            required
            class="input input-bordered"
            id="title"
            name="title"
            maxlength="20"
            bind:value={note.title}
            placeholder="Enter title of your note (max: 20 characters)"
          />
        </div>
        <div class="form-control">
          <label for="description" class="label">Description</label>
          <input
            required
            class="input input-bordered"
            id="description"
            name="description"
            maxlength="50"
            bind:value={note.description}
            placeholder="Enter a 50 character description of your note."
          />
        </div>
        <div class="form-control">
          <label for="content" class="label">Content(markdown)</label>
          <textarea
            class="textarea textarea-bordered textarea-secondary bg-white"
            id="content"
            name="content"
            bind:value={note.content}
          />
        </div>
        <div class="form-control">
          <label for="topic" class="label">Topic</label>
          <input
            class="input input-bordered"
            id="topic"
            name="topic"
            bind:value={note.topic}
            placeholder="(optional) Enter a topic for your note."
          />
        </div>
        <div class="mt-4 form-control">
          <label for="public" class="label cursor-pointer">
            <span class="label-text"
              >Public (if marked public the note will be unencrypted and
              viewable by everyone.)</span
            >
            <input
              type="checkbox"
              class="toggle toggle-secondary"
              bind:checked={note.public}
            />
          </label>
        </div>
        <p class="mt-4 alert alert-info">
          When you create a note, it will be posted on the permaweb, and can
          never be removed, if you choose to keep it private it will be
          encrypted by your wallet.
        </p>
        <div class="mt-8">
          <button type="submit" class="btn">Create Note</button>
          <a class="btn" href="/notes">Cancel</a>
        </div>
      </form>
    </div>
  </section>
</main>

<input
  type="checkbox"
  id="save-note"
  bind:checked={submitting}
  class="modal-toggle"
/>
<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Saving Note to Arweave</h3>
    <p class="py-4">
      This should only take a few seconds to store your note on the Permaweb.
      Once successfully stored, it will be stored forever.
    </p>
    <div class="flex items-center justify-center">
      <Jumper size="60" color="rebeccapurple" unit="px" duration="2s" />
    </div>

    <!--
    <div class="modal-action">
      <label for="save-note" class="btn">OK</label>
    </div>
    -->
  </div>
</div>

<input
  type="checkbox"
  id="congestion"
  bind:checked={congestion}
  class="modal-toggle"
/>
<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Arweave Gateway Processing</h3>
    <p class="py-4">
      Arweave gateway is under heavy load and is taking longer to confirm
      transactions in cache. Your note will be cached usually less than 10
      minutes.
    </p>

    <div class="modal-action">
      <button
        for="congestion"
        class="btn"
        on:click={() => {
          congestion = false;
          window.scrollTo(0, 0);
          router.goto("/notes");
        }}>OK</button
      >
    </div>
  </div>
</div>
