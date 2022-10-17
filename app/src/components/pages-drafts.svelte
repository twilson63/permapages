<script>
  export let drafts;
</script>

<div class="mt-10 w-full flex flex-row items-center justify-between">
  <div class="flex items-center gap-4">
    <h1 class="text-2xl font-bold">Drafts</h1>
    <select class="bg-white outline-none w-16  cursor-pointer">
      <option selected>All</option>
      <option>Drafts</option>
      <option>Published</option>
    </select>
  </div>
</div>
<div class="w-full flex flex-col">
  {#each drafts as draft}
    <div
      class="w-[95%] mx-auto flex flex-row items-center mt-2 justify-between border-b-[1px] py-2"
    >
      <div class="w-6 h-6 bg-red-200 rounded-full" />
      <h3
        class="text-lg font-semibold mr-auto ml-8 w-[250px] truncate text-ellipsis"
      >
        {draft.title}
      </h3>

      <h3 class="text-lg font-semibold text-[#7D7D7D] ">{draft.status}(cached)</h3>

      <div class="ml-auto flex items-center gap-4">
        <a
          href="/#/#"
          class="btn rounded-full w-[150px] h-[2.5rem] min-h-[2.5rem] bg-[#B2B2B2] border-none normal-case drop-shadow-sm"
          >Edit</a
        >
        <a
          href="/#/#"
          class="btn rounded-full w-[150px] h-[2.5rem] min-h-[2.5rem] border-gray-200 hover:border-[#B2B2B2]
           normal-case bg-white text-black hover:text-white drop-shadow-sm"
          >Publish</a
        >
      </div>
    </div>
  {/each}
</div>
