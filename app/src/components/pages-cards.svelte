<script>
  import Write from "../svg/write-svg.svelte";
  import Code from "../svg/code-svg.svelte";
  import GradientBox from "./gradient-box.svelte";
  import User from "../svg/user-svg.svelte";
  import Gallery from "../svg/gallery-svg.svelte";
  import Video from "../svg/video-svg.svelte";
  import Music from "../svg/music-svg.svelte";
  import Nft from "../svg/nft-svg.svelte";
</script>

<div class="w-full mt-10 flex flex-wrap justify-between gap-4">
  <GradientBox link="#">
    <h4
      class="text-[#7D7D7D] group-hover:bg-gradient-to-r group-hover:to-[#7B55EC] group-hover:from-[#FF00E5] group-hover:text-transparent
      group-hover:bg-clip-text text-2xl font-semibold mb-4"
    >
      Make a Blog Post
    </h4>
    <Write />
    <p
      class="opacity-[0] group-hover:opacity-[1] group-hover:bg-gradient-to-r group-hover:to-[#7B55EC] 
      group-hover:from-[#FF00E5] group-hover:text-transparent group-hover:bg-clip-text mt-4 text-xs 
      transition-all duration-500 ease-in transform scale-[0.5] group-hover:scale-[1]"
    >
      author your first permanent piece
    </p>
  </GradientBox>

  <GradientBox link="#">
    <h4
      class="text-[#7D7D7D] group-hover:bg-gradient-to-r group-hover:to-[#7B55EC] group-hover:from-[#FF00E5] group-hover:text-transparent
      group-hover:bg-clip-text text-2xl font-semibold mb-4"
    >
      Create your Profile
    </h4>
    <User />
    <p
      class="opacity-[0] group-hover:opacity-[1] group-hover:bg-gradient-to-r group-hover:to-[#7B55EC] 
      group-hover:from-[#FF00E5] group-hover:text-transparent group-hover:bg-clip-text mt-4 text-xs 
      transition-all duration-500 ease-in transform scale-[0.5] group-hover:scale-[1]"
    >
      your space on web3
    </p>
  </GradientBox>

  <GradientBox link="#">
    <h4
      class="text-[#7D7D7D] group-hover:bg-gradient-to-r group-hover:to-[#7B55EC] group-hover:from-[#FF00E5] group-hover:text-transparent
      group-hover:bg-clip-text text-2xl font-semibold mb-4"
    >
      Post Image(s)
    </h4>
    <Gallery />
    <p
      class="opacity-[0] group-hover:opacity-[1] group-hover:bg-gradient-to-r group-hover:to-[#7B55EC] 
      group-hover:from-[#FF00E5] group-hover:text-transparent group-hover:bg-clip-text mt-4 text-xs 
      transition-all duration-500 ease-in transform scale-[0.5] group-hover:scale-[1]"
    >
      upload your images in a gallery view and more
    </p>
  </GradientBox>

  <GradientBox link="#">
    <h4
      class="text-[#7D7D7D] group-hover:bg-gradient-to-r group-hover:to-[#7B55EC] group-hover:from-[#FF00E5] group-hover:text-transparent
      group-hover:bg-clip-text text-2xl font-semibold mb-4"
    >
      Upload Multimedia
    </h4>
    <div class="flex items-center gap-4">
      <Video />
      <Music />
    </div>
    <p
      class="opacity-[0] group-hover:opacity-[1] group-hover:bg-gradient-to-r group-hover:to-[#7B55EC] 
      group-hover:from-[#FF00E5] group-hover:text-transparent group-hover:bg-clip-text mt-4 text-xs 
      transition-all duration-500 ease-in transform scale-[0.5] group-hover:scale-[1]"
    >
      get your media files on the Permaweb
    </p>
  </GradientBox>

  <GradientBox link="#">
    <h4
      class="text-[#7D7D7D] group-hover:bg-gradient-to-r group-hover:to-[#7B55EC] group-hover:from-[#FF00E5] group-hover:text-transparent
      group-hover:bg-clip-text text-2xl font-semibold mb-4"
    >
      Create an NFT
    </h4>
    <Nft />
    <p
      class="opacity-[0] group-hover:opacity-[1] group-hover:bg-gradient-to-r group-hover:to-[#7B55EC] 
      group-hover:from-[#FF00E5] group-hover:text-transparent group-hover:bg-clip-text mt-4 text-xs 
      transition-all duration-500 ease-in transform scale-[0.5] group-hover:scale-[1]"
    >
      create tradeable atomic arweave NFTs
    </p>
  </GradientBox>

  <GradientBox link="#">
    <h4
      class="text-[#7D7D7D] group-hover:bg-gradient-to-r group-hover:to-[#7B55EC] group-hover:from-[#FF00E5] group-hover:text-transparent
      group-hover:bg-clip-text text-2xl font-semibold mb-4"
    >
      Free Space
    </h4>

    <Code />
    <p
      class="opacity-[0] group-hover:opacity-[1] group-hover:bg-gradient-to-r group-hover:to-[#7B55EC] 
      group-hover:from-[#FF00E5] group-hover:text-transparent group-hover:bg-clip-text mt-4 text-xs 
      transition-all duration-500 ease-in transform scale-[0.5] group-hover:scale-[1]"
    >
      make a fully custom page with html & more
    </p>
  </GradientBox>
</div>
