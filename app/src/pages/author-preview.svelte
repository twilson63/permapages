<script>
  import Copyright from "../widgets/copyright.svelte";
  import NavBar from "../components/navbar.svelte";
  import DemoPost from "../components/demo-post.svelte";
  import PostPreviewHead from "../components/post-preview-head.svelte";
  import PostStamp from "../components/post-stamp.svelte";
  import PostComments from "../components/post-comments.svelte";
  import ConnectModal from "../dialogs/connect.svelte";
  import WalletHelp from "../dialogs/help-wallet.svelte";

  let showless = true;
  const postcomments = [
    {
      id: 1,
      author: false,
      name: "Godo17",
      avtar: "./godo17.png",
      walletid: "0x0000000000000000000000000000000000000000",
      comment: `Thanks for sharing these notes. What is the latest with ANS 110
              and the others in the pipeline? Curious to learn more for an EVM
              compatible dApp I’m building with Arweave as the baselayer for the
              whole dApp.`,
      date: "2021-03-01T00:00:00.000Z",
      version: 1,
      ups: 9,
      downs: 0,
      replies: [
        {
          id: 2,
          name: "Paula",
          avtar: "./paula.png",
          walletid: "0x0000000000000000000000000000000000000000",
          comment: `I think those details are going to be shared very soon!`,
          date: "2021-03-01T00:00:00.000Z",
          version: 3,
          ups: 2,
          downs: 0,
          replies: [],
        },
        {
          id: 2,
          name: "Paula",
          avtar: "./paula.png",
          walletid: "0x0000000000000000000000000000000000000000",
          comment: `Hopefully tommorrow!`,
          date: "2022-03-01T00:00:00.000Z",
          version: 3,
          ups: 1,
          downs: 0,
          replies: [],
        },
      ],
    },
    {
      id: 3,
      author: true,
      name: "Only Arweave",
      avtar: "./onlyarweave.png",
      walletid: "0x0000000000000000000000000000000000000000",
      comment: `The release and all info related to this ANS 110 is slated 
      to be released to the public in the second week of September. Coming 
      soon, which is great as more devs use this!`,
      date: "2022-08-01T00:00:00.000Z",
      version: 3,
      ups: 11,
      downs: 0,
      replies: [],
    },
    {
      id: 1,
      author: false,
      name: "Godo17",
      avtar: "./godo17.png",
      walletid: "0x0000000000000000000000000000000000000000",
      comment: `Thanks for letting us.`,
      date: "2022-09-01T00:00:00.000Z",
      version: 3,
      ups: 2,
      downs: 0,
      replies: [],
    },
  ];

  let filteredcomments = postcomments.slice(0, 2);

  const showallcomments = () => {
    // display complete list of comments
  };

  let connectDlg = false;
  let walletHelp = false;
</script>

<NavBar />
<main class="container mx-auto min-h-screen">
  <div class="w-full flex mt-8">
    <PostStamp />

    <div class="w-full ml-4">
      <PostPreviewHead />

      <DemoPost />

      <div
        class="bg-[#F7F7F7] text-[#999999] flex items-center gap-3 py-1 px-4 rounded-full w-[350px] mt-8"
      >
        <img src="a-logo.svg" alt="a-logo" width="18px" />
        <span>view</span>
        <a href="/#/#" class="underline hover:no-underline">document history</a>
        <span>on Arweave</span>
      </div>

      <button
        class="group gradient inline-block bg-gradient-to-r from-[#FF00E5] to-[#7B55EC] rounded-full p-[2px] drop-shadow-sm 
          hover:drop-shadow-md my-10"
        on:click={() => (connectDlg = true)}
      >
        <div
          class="px-4 py-1 bg-white inline-block rounded-full group-hover:bg-gradient-to-r group-hover:to-[#7B55EC]
           group-hover:from-[#FF00E5]"
        >
          <div
            class="txt-gradient inline-block group-hover:text-white px-6 py-2 font-semibold"
          >
            Respond
          </div>
        </div>
      </button>

      <PostComments {filteredcomments} />
    </div>
  </div>

  <div class="w-full mt-6 flex items-center justify-center">
    <button
      class="font-medium text-[#364045] hover:underline"
      on:click={showallcomments}
    >
      {showless
        ? `view all (${postcomments?.length}) replies`
        : "view less comments"}
    </button>
  </div>
</main>
<Copyright />

<ConnectModal bind:open={connectDlg} on:help={() => (walletHelp = true)} />
<WalletHelp bind:open={walletHelp} />
