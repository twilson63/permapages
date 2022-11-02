<script>
  import Write from "../svg/write-svg.svelte";
  import Code from "../svg/code-svg.svelte";
  import GradientBox from "./gradient-box.svelte";
  import User from "../svg/user-svg.svelte";
  import Gallery from "../svg/gallery-svg.svelte";
  import Video from "../svg/video-svg.svelte";
  import Music from "../svg/music-svg.svelte";
  import Nft from "../svg/nft-svg.svelte";
  import PagesPostCard from "./pages-post-card.svelte";

  let firstbox = {
    title: "Make a Blog Post",
    subtitle: "author your first permanent piece",
    icon: [Write],
    link: "/pages",
  };

  let boxslist = [
    {
      title: "Create your Profile",
      subtitle: "your space on web3",
      icon: [User],
      link: "/account",
    },
    {
      title: "Post Image(s)",
      subtitle: "upload your images in a gallery view and more",
      icon: [Gallery],
      link: "https://img.arweave.dev",
    },
    {
      title: "Upload Multimedia",
      subtitle: "get your media files on the Permaweb",
      icon: [Video, Music],
      link: "https://pst.arweave.dev",
    },
    {
      title: "Create an NFT",
      subtitle: "create tradeable atomic arweave NFTs",
      icon: [Nft],
      link: "nft",
    },
    {
      title: "Free Space",
      subtitle: "make a fully custom page with html & more",
      icon: [Code],
      link: "/pages/new",
    },
  ];
  /*
  let postdata = [
    {
      id: 1,
      title: "Arweave Grow Crew #7",
      lastupdate: "3 days ago",
    },
    {
      id: 2,
      title: "Why the Permaweb matters",
      lastupdate: "1 week ago",
    },
    {
      id: 3,
      title: "Arweave Grow Crew #5",
      lastupdate: "2 weeks ago",
    },
  ];
  */
  let postdata = [];
</script>

<div class="w-full mt-10 flex flex-wrap justify-between gap-4">
  {#if postdata.length > 0}
    <PagesPostCard posts={postdata} />
  {:else}
    <GradientBox
      title={firstbox.title}
      subtitle={firstbox.subtitle}
      link={firstbox.link}
      icons={firstbox.icon}
    />
  {/if}

  {#each boxslist as box}
    <GradientBox
      title={box.title}
      subtitle={box.subtitle}
      link={box.link}
      icons={box.icon}
    />
  {/each}
</div>
