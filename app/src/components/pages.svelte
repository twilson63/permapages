<script>
  import take from "ramda/src/take";

  export let records = [];

  // g8way.io was retired; any ar.io gateway serves the tx directly
  const gateway = "https://arweave.net";
</script>

{#if records.length === 0}
  <div class="rounded-xl border border-dashed border-base-300 bg-base-100 px-6 py-16 text-center">
    <p class="font-display text-3xl font-bold">Nothing published yet.</p>
    <p class="mx-auto mt-3 max-w-sm text-base-content/65">
      Your first page takes a few minutes to write and stays up forever.
    </p>
    <a href="/pages/new" class="btn btn-primary mt-6">Write your first page</a>
  </div>
{:else}
  <div class="overflow-x-auto rounded-xl border border-base-300 bg-base-100">
    <table class="table w-full">
      <thead>
        <tr class="border-b border-base-300 text-xs uppercase tracking-[0.12em] text-base-content/50">
          <th class="bg-transparent">Title</th>
          <th class="bg-transparent hidden md:table-cell">Transaction</th>
          <th class="bg-transparent text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each records as { id, title, webpage }}
          <tr class="border-b border-base-200 last:border-none hover:bg-base-200/50">
            <td class="font-semibold">
              {title.length > 40 ? take(40, title) + "…" : title}
            </td>
            <td class="hidden md:table-cell">
              <span class="font-mono text-xs text-base-content/55">{(webpage || id).slice(0, 12)}…</span>
            </td>
            <td class="text-right whitespace-nowrap">
              <a
                target="_blank"
                href="{gateway}/{webpage || id}"
                class="btn btn-ghost btn-xs rounded-full">View</a
              >
              <a href="/pages/new?fork={id}" class="btn btn-ghost btn-xs rounded-full text-primary">Edit</a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
