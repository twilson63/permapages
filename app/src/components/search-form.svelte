<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let q = "";
  function handleSubmit() {
    dispatch("search", { q });
  }
</script>

<form
  class="card bg-base-100 shadow-xl w-full"
  on:submit|preventDefault={handleSubmit}
>
  <div class="card-body">
    <h2 class="card-title">Search for Note</h2>
    <div class="form-control w-full max-w-xs">
      <input
        bind:value={q}
        placeholder="Enter Title, Description, or Topic"
        type="text"
        class="input input-bordered w-full"
      />
    </div>
    <div class="card-actions justify-end">
      <button type="submit" class="btn btn-primary">Search</button>
    </div>
  </div>
</form>
