<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let title;
  export let records = [];

  function handle(type, id) {
    return () => {
      dispatch(type, { id });
    };
  }
</script>

<div>
  <h3 class="text-xl">{title}</h3>
  <div class="overflow-x-auto">
    <table class="table w-full">
      <!-- head -->
      <thead>
        <tr>
          <th>Subdomain</th>
          <th>TransactionId</th>
          <th>Link</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each records as record}
          <tr>
            <th>{record.subdomain}</th>
            <td>{record.records["@"]}</td>
            <td
              ><a
                target="_blank"
                class="link"
                href="https://{record.subdomain}.arweave.dev"
                >https://{record.subdomain}.arweave.dev</a
              >
            </td>
            <td>
              <button on:click={handle("change", record.id)} class="link"
                >Change</button
              >
              <button on:click={handle("transfer", record.id)} class="link"
                >Transfer</button
              >
              <button on:click={handle("remove", record.id)} class="link"
                >Remove</button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
