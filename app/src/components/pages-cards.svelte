<script>
  import Write from "../svg/write-svg.svelte";
  import Code from "../svg/code-svg.svelte";
  import GradientBox from "./gradient-box.svelte";
  import User from "../svg/user-svg.svelte";
  import Gallery from "../svg/gallery-svg.svelte";
  import Video from "../svg/video-svg.svelte";
  import Music from "../svg/music-svg.svelte";
  import Nft from "../svg/nft-svg.svelte";

  let boxslist = [
    {
      title: "Make a Blog Post",
      subtitle: "author your first permanent piece",
      icon: [Write],
      link: "write",
    },
    {
      title: "Create your Profile",
      subtitle: "your space on web3",
      icon: [User],
      link: "user",
    },
    {
      title: "Post Image(s)",
      subtitle: "upload your images in a gallery view and more",
      icon: [Gallery],
      link: "images",
    },
    {
      title: "Upload Multimedia",
      subtitle: "get your media files on the Permaweb",
      icon: [Video, Music],
      link: "multimedia",
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
      link: "code",
    },
  ];
</script>

<div class="w-full mt-10 flex flex-wrap justify-between gap-4">
  {#each boxslist as box}
    <GradientBox
      title={box.title}
      subtitle={box.subtitle}
      link={box.link}
      icons={box.icon}
    />
  {/each}
</div>
