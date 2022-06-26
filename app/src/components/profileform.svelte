<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let profile = {
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
      class="input input-bordered"
      bind:value={profile.name}
    />
  </div>
  <div class="form-control">
    <label for="bio" class="label">Bio</label>
    <textarea
      id="bio"
      name="bio"
      class="textarea textarea-bordered"
      bind:value={profile.bio}
    />
  </div>
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
        accept="image/png, image/jpeg, image/gif, image/jpg, image/svg+xml"
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
  <h3 class="text-xl mt-8">Background Image</h3>
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
  {#if avatarOption === "upload"}
    <div class="form-control">
      <label class="label">Upload Background Image</label>
      <input
        type="file"
        class="input"
        bind:files={backgroundFileInput}
        accept="image/png, image/jpeg, image/gif, image/jpg, image/svg+xml"
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
  <h3 class="text-xl mt-8">Links</h3>
  <div class="form-control">
    <label for="arweave" class="label">Arweave</label>
    <input
      id="arweave"
      name="arweave"
      class="input input-bordered"
      bind:value={profile.arweave}
    />
  </div>
  <div class="form-control">
    <label for="etherium" class="label">Etherium</label>
    <input
      id="etherium"
      name="etherium"
      class="input input-bordered"
      bind:value={profile.etherium}
    />
  </div>
  <div class="form-control">
    <label for="twitter" class="label">Twitter</label>
    <input
      id="twitter"
      name="twitter"
      class="input input-bordered"
      bind:value={profile.twitter}
    />
  </div>
  <div class="form-control">
    <label for="instagram" class="label">Instagram</label>
    <input
      id="instagram"
      name="instagram"
      class="input input-bordered"
      bind:value={profile.instagram}
    />
  </div>
  <div class="form-control">
    <label for="linkedin" class="label">LinkedIn</label>
    <input
      id="linkedin"
      name="linkedin"
      class="input input-bordered"
      bind:value={profile.linkedin}
    />
  </div>
  <div class="form-control">
    <label for="discord" class="label">Discord</label>
    <input
      id="discord"
      name="discord"
      class="input input-bordered"
      bind:value={profile.linkedin}
    />
  </div>
  <div class="mt-8">
    <button class="btn btn-primary">create</button>
  </div>
</form>
