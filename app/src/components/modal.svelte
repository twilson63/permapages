<script>
  import modalAction from "../actions/modal-action";
  import { createEventDispatcher } from "svelte";

  export let id = "1234";
  export let open = false;
  export let ok = true;
  export let cancel = false;

  const dispatch = createEventDispatcher();

  function okClick() {
    open = false;
    dispatch("click");
  }
  function cancelClick() {
    dispatch("cancel");
  }
</script>

<input type="checkbox" {id} bind:checked={open} class="modal-toggle" />
<div class="modal">
  <div class="modal-box">
    <slot />
    {#if ok}
      <div class="modal-action">
        <button class="btn" on:click={okClick}>OK</button>
        {#if cancel}
          <button class="btn btn-outline" on:click={cancelClick}>Cancel</button>
        {/if}
      </div>
    {/if}
  </div>
</div>
