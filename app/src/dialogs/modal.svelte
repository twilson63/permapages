<script>
  import { createEventDispatcher } from "svelte";

  export let id = window.crypto.randomUUID();
  export let open = false;
  export let cancel = true;
  export let bgColor = "";
  export let border = "";

  const dispatch = createEventDispatcher();

  function cancelClick() {
    dispatch("cancel");
  }
</script>

<input type="checkbox" {id} bind:checked={open} class="modal-toggle" />
<div class="modal">
  <div class="modal-box  {bgColor} {border}">
    {#if cancel}
      <button
        on:click={cancelClick}
        class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
      >
    {/if}
    <slot />
  </div>
</div>