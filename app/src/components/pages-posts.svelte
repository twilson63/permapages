<script>
  import WriteOther from "../svg/write-other-svg.svelte";
  export let posts;

  const copyTrx = (id) => {
    navigator.clipboard.writeText(id);
  };
</script>

<div class="mt-10 w-full flex flex-row items-center justify-between">
  <div class="flex items-center gap-4">
    <h1 class="text-2xl font-bold">Blog Posts</h1>
    <select class="bg-white outline-none w-16  cursor-pointer">
      <option selected>All</option>
      <option>Drafts</option>
      <option>Published</option>
    </select>
  </div>

  <a
    href="/#/pages/compose"
    class="btn flex flex-row items-center gap-2 w-[220px] justify-center p-2 rounded-full
        drop-shadow-lg bg-[#A785F1] border-none normal-case block ml-auto min-h-[2.5rem] h-[2.5rem]"
  >
    <span class="text-white">Create new Blog Post</span>
    <WriteOther col="#ffffff" />
  </a>
</div>

<div class="w-full flex flex-col">
  {#each posts as post}
    <div
      class="w-[95%] mx-auto flex flex-row items-center mt-2 justify-between border-b-[1px] py-2"
    >
      <img src={post.thumbnail} alt={post.title} width="120px" class="block" />

      <div class="ml-4 mr-auto">
        <h3 class="text-lg font-bold w-[200px] truncate text-ellipsis">
          {post.title}
        </h3>
        <p class="text-sm text-gray-500 w-[200px] truncate text-ellipsis">
          Last Update: {post.date}
        </p>
      </div>

      <div class="flex flex-col justify-start mx-auto">
        <h3 class="text-lg font-bold text-[#7D7D7D]">Stamps</h3>
        <p class="text-sm text-gray-500 flex items-center gap-2">
          <span>{post.stamps}</span>
          <img src="stamp.svg" alt="stamp" width="16px" />
        </p>
      </div>

      <div class="flex flex-col mx-auto justify-start">
        <h3 class="text-lg font-bold text-[#7D7D7D]">Transaction ID</h3>
        <p class="text-sm text-gray-500 flex items-center gap-2">
          <span class="w-[200px] truncate text-ellipsis"
            >{post.transactionsid}</span
          >
          <button
            class="cursor-pointer btn bg-transparent hover:bg-transparent border-none p-0 m-0 min-h-[20px] h-[20px]"
            on:click={() => copyTrx(post.transactionsid)}
          >
            <img src="copy.svg" alt="copy" width="16px" />
          </button>
        </p>
      </div>

      <div class="flex flex-col items-center mx-auto">
        <h3 class="text-lg font-bold text-[#7D7D7D]">Share</h3>
        <a href="/#/#"><img src="share.svg" alt="share" width="20px" /></a>
      </div>

      <div class="flex flex-col items-center mx-auto">
        <h3 class="text-lg font-bold text-[#7D7D7D]">View</h3>
        <a href="/#/#"><img src="eye.svg" alt="eye" width="20px" /></a>
      </div>

      <div class="flex flex-col items-center ml-auto">
        <h3 class="text-lg font-bold text-[#7D7D7D]">Edit</h3>
        <a href="/#/#"><img src="write.svg" alt="write" width="20px" /></a>
      </div>
    </div>
  {/each}
</div>
