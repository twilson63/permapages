<script>
  let profile = {};
  let avatarOption = "upload";
  let backgroundOption = "upload";
  let backgroundFileInput;
  let avatarFileInput;
</script>

<form class="w-full" on:submit|preventDefault={() => null}>
  <div class="form-control">
    <label for="name" class="label">Name</label>
    <input
      id="name"
      name="name"
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
  <h3 class="text-xl">Avatar</h3>
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
      <input type="file" class="input" bind:this={avatarFileInput} />
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
  <h3 class="text-xl">Background Image</h3>
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
      <input type="file" class="input" bind:this={backgroundFileInput} />
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
  <h3 class="text-xl">Links</h3>
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
</form>
