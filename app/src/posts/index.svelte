<script>
  import PagesHead from "../components/pages-head.svelte";
  import NavBar from "../components/navbar.svelte";
  import PagesPosts from "../components/pages-posts.svelte";
  import PagesDrafts from "../components/pages-drafts.svelte";
  import Copyright from "../widgets/copyright.svelte";

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
  <PagesHead>
    <a
      href="/dashboard"
      class="btn rounded-full bg-[#F9F9F9] min-h-[2.5rem] h-[2.5rem] px-8 hover:bg-gray-200 border-none"
    >
      <img src="polygon-icon.svg" alt="polygon-icon" />
      <span class="text-[#696969] ml-4">Back</span>
    </a>
  </PagesHead>

  <PagesPosts {posts} />
  <PagesDrafts {drafts} />

  <Copyright />
</main>
