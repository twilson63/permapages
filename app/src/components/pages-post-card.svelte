<script>
  import WriteOther from "../svg/write-other-svg.svelte";
  import EyeSvg from "../svg/eye-svg.svelte";

  export let posts;
</script>

<div
  class="group post-box p-[1px] hover:bg-gradient-to-r hover:from-[#FF00E5] hover:to-[#7B55EC] hover:drop-shadow-md "
>
  <div
    class="bg-[#F9F9F9] w-full h-full rounded-3xl flex flex-col items-center border p-6"
  >
  <a
  href="/#/pages/compose"
  class="btn flex flex-row items-center gap-2 w-[220px] justify-center p-2 rounded-full
    drop-shadow-lg bg-[#A785F1] border-none normal-case min-h-[2.5rem] h-[2.5rem]"
>
  <span class="text-white">Create new Blog Post</span>
  <WriteOther col="#ffffff" />
</a>

    <ul
      class="divide-y divide-white divide-y-2 w-full flex flex-col gap-3 mt-8"
      aria-label="list"
    >
      {#each posts as post}
        <li class="text-[#7D7D7D] flex flex-row items-center justify-between">
          <a href="/#/#" class="hover:underline w-[50%] truncate text-ellipsis"
            >{post.title}</a
          >
          <span class="opacity-[0.5]"> - {post.lastupdate}</span>

          <div class="ml-auto w-[60px] flex items-center justify-between">
            <a href="/#/#" class="hover:underline inline-block eye-svg">
              <EyeSvg />
            </a>

            <a href="/#/#" class="hover:underline inline-block write-svg">
              <WriteOther col="#7d7d7d" />
            </a>
          </div>
        </li>
      {/each}
    </ul>

    {#if posts.length > 2}
      <a
        href="/#/pages/posts"
        class="inline-block text-center mt-auto text-[#7D7D7D] hover:no-underline underline font-semibold"
        >View all</a
      >
    {/if}
  </div>
</div>

<style>
  .post-box {
    @apply relative bg-white w-[32%] min-h-[270px] rounded-3xl drop-shadow-sm inline-block;
  }
</style>
