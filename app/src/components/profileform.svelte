<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let profile = {
    links: {},
  };
  let avatarOption = "upload";
  let backgroundOption = "upload";
  let backgroundFileInput;
  let avatarFileInput;

  let tabs = ["tab1", "tab2", "tab3", "tab4", "tab5", "tab6"];
  $: currentTab = "tab1";

  function next() {
    let i = tabs.indexOf(currentTab);
    if (i === tabs.length) {
      return;
    }
    currentTab = tabs[++i];
  }

  function prev() {
    let i = tabs.indexOf(currentTab);
    if (i === 0) {
      return;
    }
    currentTab = tabs[--i];
  }

  const toArrayBuffer = (file) =>
    new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.readAsArrayBuffer(file);
      fr.addEventListener("loadend", (evt) => {
        resolve(evt.target.result);
      });
    });

  async function handleSubmit() {
    const avatar = avatarFileInput
      ? {
          type: avatarFileInput[0].type,
          buffer: await toArrayBuffer(avatarFileInput[0]),
        }
      : null;
    const background = backgroundFileInput
      ? {
          type: backgroundFileInput[0].type,
          buffer: await toArrayBuffer(backgroundFileInput[0]),
        }
      : null;
    dispatch("create", { profile, avatar, background });
  }
</script>

<form class="w-full h-full" on:submit|preventDefault={handleSubmit}>
  <div class="relative h-full">
    <div class="tabs">
      <a
        class="tab tab-bordered"
        class:tab-active={currentTab === "tab1"}
        on:click={() => (currentTab = "tab1")}>Profile</a
      >
      <a
        class="tab tab-bordered"
        class:tab-active={currentTab === "tab2"}
        on:click={() => (currentTab = "tab2")}>Avatar</a
      >
      <a
        class="tab tab-bordered"
        class:tab-active={currentTab === "tab3"}
        on:click={() => (currentTab = "tab3")}>Background Banner</a
      >
      <a
        class="tab tab-bordered"
        class:tab-active={currentTab === "tab4"}
        on:click={() => (currentTab = "tab4")}>Web3 Addresses</a
      >
      <a
        class="tab tab-bordered"
        class:tab-active={currentTab === "tab5"}
        on:click={() => (currentTab = "tab5")}>Social Networks</a
      >
      <a
        class="tab tab-bordered"
        class:tab-active={currentTab === "tab6"}
        on:click={() => (currentTab = "tab6")}>Platforms</a
      >
    </div>
    {#if currentTab === "tab1"}
      <h4 class="mt-4 text-2xl">Account Information</h4>
      <p class="text-sm">
        Add your username, with no spaces, it should be less than 20 characters.
      </p>
      <div class="form-control mt-8">
        <label for="name" class="label"
          >Name <span class="text-secondary">* required</span></label
        >
        <input
          id="name"
          name="name"
          required
          maxlength="20"
          pattern="[^' ']+"
          class="input input-bordered input-secondary"
          bind:value={profile.name}
        />
        <small class="mt-2">(20 characters max, no spaces allowed)</small>
      </div>
      <div class="form-control mt-8 mb-8">
        <label for="bio" class="label">Bio</label>
        <textarea
          id="bio"
          name="bio"
          maxlength="150"
          class="textarea textarea-bordered"
          bind:value={profile.bio}
        />
        <small class="mt-2">(150 characters max)</small>
      </div>
    {:else if currentTab === "tab2"}
      <h3 class="text-xl mt-8">Avatar</h3>
      <p class="my-4">Upload your avatar or add an URL link</p>

      <div class="bg-info text-black rounded px-4 py-4 my-8 w-full">
        You can either upload an image from your device or paste an `image_url`
        from your<br /> NFT gallery. Use the radio buttons to choose from upload
        file from your device to<br /> paste a link from an image in your gallery.
      </div>
      <div class="my-8 form-control">
        <small>Choose between 'Upload' or 'Link'</small>
        <label class="label">
          Upload image from device
          <input
            type="radio"
            name="avatarOption"
            value="upload"
            class="radio radio-secondary"
            bind:group={avatarOption}
          />
        </label>
        <label class="label">
          Link to an image
          <input
            type="radio"
            name="avatarOption"
            value="url"
            bind:group={avatarOption}
            class="radio radio-secondary"
          />
        </label>
      </div>
      {#if avatarOption === "upload"}
        <div class="form-control">
          <label class="label">Upload from device Avatar</label>
          <input
            type="file"
            class="input"
            bind:files={avatarFileInput}
            accept="image/png, image/jpeg, image/jpg, image/svg+xml"
          />
        </div>
      {:else}
        <div class="form-control">
          <label for="avatar" class="label">Link from web</label>
          <input
            id="avatar"
            name="avatar"
            type="url"
            class="input input-bordered"
            bind:value={profile.avatar}
          />
        </div>
      {/if}
    {:else if currentTab === "tab3"}
      <h3 class="text-xl mt-8">Background Image</h3>
      <div class="bg-info text-black rounded px-4 py-4 my-8 w-full">
        <p>
          The best background images ideal size is 1500x360 px. Files larger
          than
        </p>
        <p>100kb will cost AR to upload.</p>
      </div>

      <p class="my-4">Upload your background or add an URL link</p>
      <div class="my-8 form-control">
        <small>Choose between 'Upload' or 'Link'</small>
        <div class="form-control">
          <label class="label">
            Upload image from device
            <input
              type="radio"
              name="backgroundOption"
              value="upload"
              class="radio radio-secondary"
              bind:group={backgroundOption}
            />
          </label>
          <label class="label">
            Link to an image from web
            <input
              type="radio"
              name="backgroundOption"
              value="url"
              bind:group={backgroundOption}
              class="radio radio-secondary"
            />
          </label>
        </div>
        {#if backgroundOption === "upload"}
          <div class="form-control mt-4">
            <label class="label">Upload from device</label>
            <input
              type="file"
              class="input"
              bind:files={backgroundFileInput}
              accept="image/png, image/jpeg, image/jpg, image/svg+xml"
            />
          </div>
        {:else}
          <div class="form-control mt-4">
            <label for="background" class="label">Link from web</label>
            <input
              id="background"
              name="background"
              class="input input-bordered"
              bind:value={profile.background}
            />
          </div>
        {/if}
      </div>
    {:else if currentTab === "tab4"}
      <h3 class="text-xl mt-8">Web3 Addresses</h3>
      <div class="my-4">
        <p>
          Enable Permapage Widgets to connect to your NFT Galleries and provide
        </p>
        <p>other connectivity within the web3 ecosystem.</p>
      </div>
      <div class="form-control">
        <label for="arweave" class="label">Arweave</label>
        <input
          id="arweave"
          name="arweave"
          maxlength="100"
          pattern="[^' ']+"
          class="input input-bordered"
          placeholder="Arweave Wallet Address"
          bind:value={profile.links.arweave}
        />
      </div>
      <div class="form-control">
        <label for="ethereum" class="label">Ethereum</label>
        <input
          id="ethereum"
          name="ethereum"
          maxlength="100"
          pattern="[^' ']+"
          placeholder="ethereum Wallet Address"
          class="input input-bordered"
          bind:value={profile.links.ethereum}
        />
      </div>
    {:else if currentTab === "tab5"}
      <h3 class="text-xl mt-8">Social Networks</h3>
      <div class="my-4">
        <p>Add social links to your Permapage</p>
      </div>
      <div class="form-control">
        <label for="twitter" class="label">Twitter</label>
        <input
          id="twitter"
          name="twitter"
          class="input input-bordered"
          maxlength="30"
          pattern="[^' ']+"
          placeholder="twitter handle - max 30 characters"
          bind:value={profile.links.twitter}
        />
      </div>
      <div class="form-control">
        <label for="instagram" class="label">Instagram</label>
        <input
          id="instagram"
          name="instagram"
          class="input input-bordered"
          maxlength="30"
          pattern="[^' ']+"
          placeholder="instagram handle - max 30 characters"
          bind:value={profile.links.instagram}
        />
      </div>
      <div class="form-control">
        <label for="linkedin" class="label">LinkedIn</label>
        <input
          id="linkedin"
          name="linkedin"
          class="input input-bordered"
          bind:value={profile.links.linkedin}
          maxlength="30"
          pattern="[^' ']+"
          placeholder="linkedin handle - max 30 characters"
        />
      </div>
      <div class="form-control">
        <label for="facebook" class="label">Facebook</label>
        <input
          id="facebook"
          name="facebook"
          class="input input-bordered"
          bind:value={profile.links.facebook}
          maxlength="30"
          pattern="[^' ']+"
          placeholder="facebook handle - max 30 characters"
        />
      </div>
    {:else if currentTab === "tab6"}
      <h3 class="text-xl mt-8">Other Links</h3>
      <div class="my-4">
        <p>Add links to other popular platforms</p>
      </div>
      <div class="form-control">
        <label for="youtube" class="label">Youtube</label>
        <input
          id="youtube"
          name="youtube"
          class="input input-bordered"
          maxlength="30"
          pattern="[^' ']+"
          placeholder="youtube handle - max 30 characters"
          bind:value={profile.links.youtube}
        />
      </div>
      <div class="form-control">
        <label for="twitch" class="label">Twitch</label>
        <input
          id="twitch"
          name="twitch"
          class="input input-bordered"
          bind:value={profile.links.twitch}
          maxlength="30"
          pattern="[^' ']+"
          placeholder="facebook handle - max 30 characters"
        />
      </div>
      <div class="form-control">
        <label for="github" class="label">Github</label>
        <input
          id="github"
          name="github"
          class="input input-bordered"
          bind:value={profile.links.github}
          maxlength="30"
          pattern="[^' ']+"
          placeholder="github handle - max 30 characters"
        />
      </div>
    {/if}
    <div class="absolute bottom-4 mt-16 space-x-2">
      <button
        on:click={prev}
        type="button"
        class="btn btn-secondary"
        disabled={tabs.indexOf(currentTab) === 0}>Previous</button
      >
      <button
        on:click={next}
        type="button"
        class="btn btn-primary"
        disabled={tabs.indexOf(currentTab) === 5}>Next</button
      >
      <button class="btn" class:btn-outline={tabs.indexOf(currentTab) < 5}
        >Finish</button
      >
      <a class="btn btn-outline" href="/account">Cancel</a>
    </div>
  </div>
</form>
