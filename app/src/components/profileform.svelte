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

<form class="w-full" on:submit|preventDefault={handleSubmit}>
  <div class="form-control">
    <label for="name" class="label">Name</label>
    <input
      id="name"
      name="name"
      required
      maxlength="20"
      pattern="[^' ']+"
      class="input input-bordered"
      bind:value={profile.name}
    />
    <small class="mt-2">(20 characters max, no spaces allowed)</small>
  </div>
  <div class="form-control mb-8">
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
  <hr />
  <h3 class="text-xl mt-8">Avatar</h3>
  <div class="form-control">
    <label class="label">
      Upload
      <input
        type="radio"
        name="avatarOption"
        value="upload"
        class="radio radio-secondary"
        bind:group={avatarOption}
      />
    </label>
    <label class="label">
      URL
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
      <label class="label">Upload Avatar</label>
      <input
        type="file"
        class="input"
        bind:files={avatarFileInput}
        accept="image/png, image/jpeg, image/jpg, image/svg+xml"
      />
    </div>
  {:else}
    <div class="form-control">
      <label for="avatar" class="label">URL for Avatar</label>
      <input
        id="avatar"
        name="avatar"
        class="input input-bordered"
        bind:value={profile.avatar}
      />
    </div>
  {/if}
  <hr />
  <h3 class="text-xl mt-8">Background Image</h3>
  <div class="alert alert-info my-8">
    The best background images ideal size is 1500x360 px. Files larger than
    100kb will cost AR to upload.
  </div>
  <div class="form-control">
    <label class="label">
      Upload
      <input
        type="radio"
        name="backgroundOption"
        value="upload"
        class="radio radio-secondary"
        bind:group={backgroundOption}
      />
    </label>
    <label class="label">
      URL
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
    <div class="form-control">
      <label class="label">Upload Background Image</label>
      <input
        type="file"
        class="input"
        bind:files={backgroundFileInput}
        accept="image/png, image/jpeg, image/jpg, image/svg+xml"
      />
    </div>
  {:else}
    <div class="form-control">
      <label for="background" class="label">URL for Background Image</label>
      <input
        id="background"
        name="background"
        class="input input-bordered"
        bind:value={profile.background}
      />
    </div>
  {/if}
  <hr />
  <h3 class="text-xl mt-8">Links</h3>
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
    <label for="etherium" class="label">Etherium</label>
    <input
      id="etherium"
      name="etherium"
      maxlength="100"
      pattern="[^' ']+"
      placeholder="Etherium Wallet Address"
      class="input input-bordered"
      bind:value={profile.links.etherium}
    />
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
    <label for="discord" class="label">Discord</label>
    <input
      id="discord"
      name="discord"
      class="input input-bordered"
      bind:value={profile.links.discord}
      maxlength="30"
      pattern="[^' ']+"
      placeholder="discord handle - max 30 characters"
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
  <div class="mt-8">
    <button class="btn btn-primary">submit</button>
  </div>
</form>
