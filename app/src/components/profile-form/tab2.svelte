<script>
  export let profile = {};
  let avatarOption = "upload";
  let avatarFileInput;
</script>

<h3 class="text-xl mt-8">Avatar</h3>
<p class="my-4">Upload your avatar or add an URL link</p>
<div class="my-16 form-control">
  <small>Choose between 'Upload' or 'Link'</small>
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
    Link
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
    <label for="avatar" class="label">Link (URL) for Avatar</label>
    <input
      id="avatar"
      name="avatar"
      type="url"
      class="input input-bordered"
      bind:value={profile.avatar}
    />
  </div>
{/if}
