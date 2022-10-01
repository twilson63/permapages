<script>
  import Howitworks from "./home/how-it-works.svelte";
  import Createprofile from "./home/create-profile.svelte";
  import ConnectModal from "./dialogs/connect.svelte";
  import WalletHelp from "./dialogs/help-wallet.svelte";

  let connectDlg = false;
  let walletHelp = false;
</script>

<main>
  <section class="hero min-h-[600px] bg-base-200">
    <div class="hero-content flex-col md:flex-row space-x-16">
      <div class="max-w-md flex-1">
        <h1 class="text-5xl font-bold">
          compose
          <span class="badge badge-secondary">BETA 11</span>
        </h1>
        <p class="mt-8 mb-4 md:mb-16">
          Create and manage your own permanent web3 profile and permaweb pages
          built on Arweave.
        </p>
        <div class="flex space-x-2">
          <button class="btn btn-primary" on:click={() => (connectDlg = true)}
            >Connect Wallet</button
          >
          <button class="btn btn-outline">Learn more</button>
        </div>
      </div>
      <div class="md:inline-block flex-1 place-items-center">
        <img
          class="w-3/4"
          src="images/permapageslanding-p-800.png"
          alt="permapages"
        />
      </div>
    </div>
  </section>
  <Howitworks />
</main>
<ConnectModal bind:open={connectDlg} on:help={() => (walletHelp = true)} />
<WalletHelp bind:open={walletHelp} />
