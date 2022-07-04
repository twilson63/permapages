<script>
  import { createEventDispatcher } from "svelte";
  import { Jumper } from "svelte-loading-spinners";

  const dispatch = createEventDispatcher();

  export let title;
  export let records = [];

  function handle(type, id) {
    return () => {
      dispatch(type, { id });
    };
  }

  async function checkSubdomain(subdomain) {
    const result = await fetch(`https://${subdomain}.arweave.dev`);
    if (result.status === 200) {
      return true;
    }

    return false;
  }
</script>

<div>
  <h3 class="text-xl">{title}</h3>
  <div class="overflow-x-auto">
    <table class="table w-full">
      <!-- head -->
      <thead>
        <tr>
          <th />
          <th>Subdomain</th>
          <th>TransactionId</th>
          <th>Link</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each records as record}
          <tr>
            <td>
              {#await checkSubdomain(record.subdomain) then active}
                {#if active}
                  <div class="bg-success text-success rounded-2xl w-[24px]">
                    U
                  </div>
                {:else}
                  <Jumper size="32" color="pink" />
                {/if}
              {/await}
            </td>
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
              <button
                on:click={handle("change", record.id)}
                class="link uppercase">Change</button
              >
              <button
                on:click={handle("transfer", record.id)}
                class="link uppercase">Transfer</button
              >
              <button
                on:click={handle("remove", record.id)}
                class="link uppercase">Remove</button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
