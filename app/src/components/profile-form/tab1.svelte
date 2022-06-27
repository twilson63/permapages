<script>
  let profile = { links: null };
</script>

<h4 class="mt-4 text-2xl">Account Information</h4>
<p class="text-sm">
  Add your username, with no spaces, it should be less than 20 characters.
</p>
<div class="form-control mt-8">
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
