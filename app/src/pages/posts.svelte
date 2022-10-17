<script>
  import PagesHead from "../components/pages-head.svelte";
  import NavBar from "../components/navbar.svelte";
  import PagesPosts from "../components/pages-posts.svelte";
  import PagesDrafts from "../components/pages-drafts.svelte";

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

  let drafts = [
    {
      postid: 1,
      title: "untitled",
      status: "Draft",
    },
    {
      postid: 2,
      title: "Concepts for product-led growth",
      status: "Draft",
    },
    {
      postid: 3,
      title: "Making a new Atomic NFT",
      status: "Draft",
    },
  ];
</script>

<NavBar />
<main class="container mx-auto min-h-screen">
  <PagesHead />

  <PagesPosts {posts} />
  <PagesDrafts {drafts} />

  <div
    class="flex flex-row items-center gap-2 w-[220px] mx-auto justify-center my-10 py-2 rounded-full
    bg-gradient-to-r from-[#FF00E5] to-[#7B55EC] drop-shadow-lg cursor-pointer"
  >
    <img src="magic-hand.png" alt="magic-hand" width="30px" />
    <span class="text-white font-semibold">Created on Compose</span>
  </div>
</main>
