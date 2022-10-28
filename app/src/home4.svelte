<script>
  import ConnectModal from "./dialogs/connect.svelte";
  import WalletHelp from "./dialogs/help-wallet.svelte";
  import { address } from "./store.js";
  import { router } from "tinro";

  let connectDlg = false;
  let walletHelp = false;
</script>

<main class="min-h-screen bg-[#364045] ">
  <!--
  <div class="flex justify-end p-4">
    <a href="/pages" class="inline-block text-right text-white hover:underline"
      >Explore Pages</a
    >
  </div>
-->
  <div class="w-full flex flex-col items-center justify-center">
    <img src="magic-hand.png" alt="magic-hand" width="130px" />
    <h1
      class="text-8xl text-transparent font-bold bg-clip-text bg-gradient-to-r from-[#FF00E5] to-[#7B55EC]"
    >
      compose
    </h1>
    <p class="text-[#F7F7F7] font-semibold mt-4 tracking-widest">
      your creative portal to the permaweb
    </p>

    <button
      on:click={() => {
        if ($address) {
          router.goto("/account");
        } else {
          connectDlg = true;
        }
      }}
      class="text-[#F7F7F7] border-4 rounded-full p-2 px-10 font-semibold mt-12 hover:bg-[#F7F7F7] hover:text-black"
      >{$address ? "account" : "connect"}</button
    >
    <a href="/#/#" class="text-[#F7F7F7] inline-block mt-5 hover:underline"
      >learn more</a
    >
  </div>

  <div class="">
    <img src="wave img.png" alt="wave" />
  </div>
</main>

<ConnectModal bind:open={connectDlg} on:help={() => (walletHelp = true)} />
<WalletHelp bind:open={walletHelp} />
