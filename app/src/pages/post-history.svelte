<script>
  import PagesHead from "../components/pages-head.svelte";
  import NavBar from "../components/navbar.svelte";
  import WriteOther from "../svg/write-other-svg.svelte";
  import Copyright from "../widgets/copyright.svelte";

  const posthistory = [
    {
      isLive: false,
      postid: 1,
      thumbnail: "./post-placeholder.png",
      title: "Arweave Grow Crew #6",
      date: "1 Days ago",
      version: "1.0",
      stamps: 23,
      status: "Drafts",
      transactionsid: "dfh8ddjKd9-dbvDe3eg_2gtp6ofPwQl7",
    },
    {
      isLive: false,
      postid: 2,
      thumbnail: "./post-placeholder.png",
      title: "Arweave Grow Crew #6",
      date: "5 Days ago",
      version: "1.2",
      stamps: 17,
      status: "Drafts",
      transactionsid: "dfh8ddjKd9-dbvDe3eg_2gtp6ofPwQl7",
    },
    {
      isLive: true,
      postid: 3,
      thumbnail: "./post-placeholder.png",
      title: "Arweave Grow Crew #6",
      date: "6 Weeks ago",
      version: "1.3",
      stamps: 53,
      status: "Drafts",
      transactionsid: "dfh8ddjKd9-dbvDe3eg_2gtp6ofPwQl7",
    },
  ];

  const copyTrx = (id) => {
    navigator.clipboard.writeText(id);
  };
</script>

<NavBar />
<main class="container mx-auto min-h-screen">
  <PagesHead>
    <a
      href="/#/pages"
      class="btn rounded-full bg-[#F9F9F9] min-h-[2.5rem] h-[2.5rem] px-8 hover:bg-gray-200 border-none"
    >
      <img src="polygon-icon.svg" alt="polygon-icon" />
      <span class="text-[#696969] ml-4">Back</span>
    </a>
  </PagesHead>

  <div class="mt-10 w-full flex flex-row items-center justify-between">
    <div class="flex items-center gap-4">
      <h1 class="text-2xl font-bold">Version History</h1>

      <div class="flex items-center gap-2">
        <span>Arweave Grow Crew #6</span>
        <button>
          <img src="./arrow-down.svg" alt="arrow" class="w-5" />
        </button>
      </div>
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

  <div
    role="list"
    class="flex flex-col mt-8"
  >
    {#each posthistory as post}
      {#if post.isLive}
        <div
          class="bg-gradient-to-r from-[#FF00E5] to-[#7B55EC] w-full h-28 flex justify-between items-center rounded-3xl p-[1px] relative mt-3 mb-2"
        >
          <span
            class="text-center bg-gradient-to-r from-[#FF00E5] to-[#7B55EC] text-white text-sm rounded-full absolute right-[50%] -top-3 w-24 h-6"
            >Current</span
          >
          <div class="h-full w-full bg-white rounded-3xl">
            <div class="w-full h-28 flex justify-between items-center p-8">
              <img src={post.thumbnail} alt={post.title} width="120px" />

              <div class="ml-4 mr-auto">
                <h5 class="text-xs font-[400] text-[#364045]">
                  Version {post.version}
                </h5>
                <h3
                  class="text-lg font-bold w-[200px] truncate text-ellipsis text-[#263238]"
                >
                  {post.title}
                </h3>
                <p
                  class="text-sm text-gray-500 w-[200px] truncate text-ellipsis"
                >
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
                <button><img src="share.svg" alt="share" width="25px" /></button
                >
              </div>

              <div class="flex flex-col items-center mx-auto">
                <h3 class="text-lg font-bold text-[#7D7D7D]">View</h3>
                <a href="/#/post/author-preview"
                  ><img src="eye.svg" alt="eye" width="25px" /></a
                >
              </div>

              <div class="flex flex-col items-center ml-auto">
                <h3 class="text-lg font-bold text-[#7D7D7D]">Remix</h3>
                <a href="/#/#"
                  ><img src="write.svg" alt="write" width="25px" /></a
                >
              </div>
            </div>
          </div>
        </div>
      {:else}
        <div class="h-full w-full bg-white rounded-3xl my-2">
          <div class="w-full h-28 flex justify-between items-center p-8">
            <img src={post.thumbnail} alt={post.title} width="120px" />

            <div class="ml-4 mr-auto">
              <h5 class="text-xs font-[400] text-[#364045]">
                Version {post.version}
              </h5>
              <h3
                class="text-lg font-bold w-[200px] truncate text-ellipsis text-[#263238]"
              >
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
              <button><img src="share.svg" alt="share" width="25px" /></button>
            </div>

            <div class="flex flex-col items-center mx-auto">
              <h3 class="text-lg font-bold text-[#7D7D7D]">View</h3>
              <a href="/#/post/author-preview"
                ><img src="eye.svg" alt="eye" width="25px" /></a
              >
            </div>

            <div class="flex flex-col items-center ml-auto">
              <h3 class="text-lg font-bold text-[#7D7D7D]">Edit</h3>
              <a href="/#/#"><img src="write.svg" alt="write" width="25px" /></a
              >
            </div>
          </div>
        </div>
      {/if}
    {/each}
  </div>
</main>
<Copyright />
