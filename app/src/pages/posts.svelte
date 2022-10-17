<script>
  import PagesHead from "../components/pages-head.svelte";
  import WriteOther from "../svg/write-other-svg.svelte";
  import NavBar from "../components/navbar.svelte";
  import PagesPosts from "../components/pages-posts.svelte";

  let posts = [
    {
      postid: 1,
      thumbnail: "http://via.placeholder.com/120x60",
      title: "Arweave Grow Crew #7",
      date: "3 Days ago",
      stamps: 23,
      status: "Drafts",
      transactionsid: "dfh8ddjKd9-dbvDe3eg_2gtp6ofPwQl7",
    },
    {
      postid: 2,
      thumbnail: "http://via.placeholder.com/120x60",
      title: "Why the Permaweb matters",
      date: "1 Week ago",
      stamps: 23,
      status: "Drafts",
      transactionsid: "dfh8ddjKd9-dbvDe3eg_2gtp6ofPwQl7",
    },
    {
      postid: 3,
      thumbnail: "http://via.placeholder.com/120x60",
      title: "Arweave Grow Crew #6",
      date: "2 Weeks ago",
      stamps: 23,
      status: "Published",
      transactionsid: "dfh8ddjKd9-dbvDe3eg_2gtp6ofPwQl7",
    },
    {
      postid: 4,
      thumbnail: "http://via.placeholder.com/120x60",
      title: "Uploading and creating your...",
      date: "1 Month ago",
      stamps: 23,
      status: "Published",
      transactionsid: "dfh8ddjKd9-dbvDe3eg_2gtp6ofPwQl7",
    },
  ];

  const copyTrx = (id) => {
    navigator.clipboard.writeText(id);
  };
</script>

<NavBar />
<main class="container mx-auto min-h-screen">
  <PagesHead />

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
      href="/#/#"
      class="btn flex flex-row items-center gap-2 w-[220px] justify-center p-2 rounded-full
        drop-shadow-lg bg-[#A785F1] border-none normal-case block ml-auto min-h-[2.5rem] h-[2.5rem]"
    >
      <span class="text-white">Create new Blog Post</span>
      <WriteOther col="#ffffff" />
    </a>
  </div>

  <div class="w-full flex flex-col" />
  <PagesPosts {posts} />

  <div
    class="flex flex-row items-center gap-2 w-[220px] mx-auto justify-center my-10 py-2 rounded-full
    bg-gradient-to-r from-[#FF00E5] to-[#7B55EC] drop-shadow-lg cursor-pointer"
  >
    <img src="magic-hand.png" alt="magic-hand" width="30px" />
    <span class="text-white font-semibold">Created on Compose</span>
  </div>
</main>
