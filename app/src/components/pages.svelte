<script>
  export let records = [];
</script>

<table class="table w-full">
  <!-- head -->
  <thead>
    <tr>
      <th>Title</th>
      <th>Description</th>
      <th>TransactionId</th>
      <th>Actions</th>
    </tr>
  </thead>
  {#each records as { id, title, description, webpage }}
    <tbody>
      <!-- row 1 -->
      <tr>
        <td>{title}</td>
        <td>{description}</td>
        <td>{id}</td>

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
  {/each}
</table>
