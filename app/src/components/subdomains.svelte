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

  function handleChange(data) {
    return () => {
      dispatch("change", data);
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
          {#each Object.entries(record.records) as x}
            {#if x[0] === "@"}
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
                    on:click={handleChange({ ANT: record.id, subdomain: "@" })}
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
            {:else}
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
                    href="https://{x[0]}_{record.subdomain}.arweave.dev"
                    >{x[0]}_{record.subdomain}</a
                  ></th
                >
                <td class="hidden md:table-cell">{x[1].transactionId}</td>
                <td class="hidden md:table-cell"
                  ><a
                    target="_blank"
                    class="link"
                    href="https://{x[0]}_{record.subdomain}.arweave.dev"
                    >https://{x[0]}_{record.subdomain}.arweave.dev</a
                  >
                </td>
                <td>
                  <button
                    on:click={handleChange({ ANT: record.id, subdomain: x[0] })}
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
                      subdomain: x[0],
                    })}
                    class="link uppercase">RM</button
                  >
                </td>
              </tr>
            {/if}
          {/each}
        {/each}
      </tbody>
    </table>
  </div>
</div>
