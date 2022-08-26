<script>
  import take from "ramda/src/take";

  export let records = [];
</script>

<table class="table w-full">
  <!-- head -->
  <thead>
    <tr>
      <th>Title</th>
      <th>Last Status</th>
      <th>TransactionId</th>
      <th>Actions</th>
    </tr>
  </thead>
  {#each records as { id, title, status, webpage }}
    <tbody>
      <!-- row 1 -->
      <tr>
        <td>{title.length > 30 ? take(30, title) + "..." : title}</td>
        <td>{status ? status.split(0, 50) : "no status"}...</td>
        <td>{webpage}</td>

        <td>
          <a
            target="_blank"
            href="https://arweave.net/{webpage}"
            class="link uppercase">Link</a
          >
          <a href="/pages/new?fork={id}" class="link uppercase">Edit</a>
        </td>
      </tr>
    </tbody>
  {:else}
    <div class="h-full text-center">
      <div class="text-[60px]">🐘</div>
      <h1 class="text-6xl">Create your first Permapage!</h1>
    </div>
  {/each}
</table>
