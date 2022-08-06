<script>
  import { createEventDispatcher } from "svelte";
  import { Jumper } from "svelte-loading-spinners";
  import { record } from "zod";

  const dispatch = createEventDispatcher();

  export let title;
  export let records = [];

  function handle(type, id) {
    return () => {
      dispatch(type, { id });
    };
  }

  function handleRemove(data) {
    return () => {
      dispatch("remove", data);
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
          <th class="hidden md:table-cell">TransactionId</th>
          <th class="hidden md:table-cell">Link</th>
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
            <th
              ><a
                target="_blank"
                class="link"
                href="https://{record.subdomain}.arweave.dev"
                >{record.subdomain}</a
              ></th
            >
            <td class="hidden md:table-cell"
              >{record.records["@"].transactionId
                ? record.records["@"].transactionId
                : record.records["@"]}</td
            >
            <td class="hidden md:table-cell"
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
                class="link uppercase">CHG</button
              >
              <!--
              <button
                on:click={handle("transfer", record.id)}
                class="link uppercase">TSFR</button
              >
              -->
              <button
                on:click={handleRemove({
                  ANT: record.id,
                  subdomain: record.subdomain,
                })}
                class="link uppercase">RM</button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
