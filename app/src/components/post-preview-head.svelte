<script>
  export let post;
</script>

<div class="w-1/4 flex flex-row items-center">
  <img src={post.author.avtar} alt={post.author.username} />
  <div class="ml-4">
    <h3 class="flex flex-row items-center text-lg font-bold">
      <span>@{post.author.username}</span>
      <a href="/#/#" class="inline-block ml-2">
        <img src="twitter.svg" alt="twitter" />
      </a>
    </h3>
    <p>{post.author.slogan}</p>
  </div>
</div>

<div class="w-full mt-8 flex flex-row items-center justify-between">
  <div class="">
    <h3 class="text-xl font-bold">{post.title}</h3>
    <p class="bg-gray-100 text-gray-400 px-6 py-1 rounded-full mt-2">
      {new Date(post.date).toLocaleDateString("en-us", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
      <a href="/#/#" class="underline hover:no-underline"
        >version {post.version}</a
      >
    </p>
  </div>

  {#if post.isAuthor}
    <a
      href="/#/#"
      target="_blank"
      class="font-semibold bg-gray-100 text-gray-500 inline-block py-2 px-6 rounded-full"
      >View as reader</a
    >
  {/if}

  <div class="flex flex-row items-center gap-4">
    {#if post.isAuthor}
      <a
        href="/#/#"
        class="font-semibold text-[#7EBFFF] bg-[#F5FAFF] inline-block py-2 px-6 rounded-full hover:drop-shadow-md cursor-pointer"
        >Update</a
      >
    {:else}
      <button
        class="font-semibold text-[#7EBFFF] bg-[#F5FAFF] inline-block py-2 px-6 rounded-full hover:drop-shadow-md cursor-pointer"
        >Subscribe</button
      >
    {/if}

    <button
      class="font-semibold py-2 px-6 rounded-full bg-gray-100 text-gray-500 hover:drop-shadow-md cursor-pointer"
      >Share</button
    >
  </div>
</div>
