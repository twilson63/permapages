<script>
  import { address } from "./store.js";
  let version = __APP_VERSION__.split(".")[2];
</script>

<div class="hero min-h-screen bg-base-200 items-start">
  <div class="w-full">
    <div class="badge badge-secondary ml-16 mt-4 float-left">
      BETA {version}
    </div>
  </div>
  <div class="hero-content text-center">
    <div class="w-full">
      <figure class="flex items-center justify-center">
        <img
          class="h-[200px] rounded-lg"
          src="permapages_logo.svg"
          alt="logo"
        />
      </figure>

      <h1 class="mt-8 text-5xl text-left">
        <span class="uppercase text-primary">Welcome to Permapages!</span>
      </h1>
      <div class="flex space-x-16">
        <div class="flex mt-8 space-x-2 flex-col justify-start text-left w-1/2">
          <p class="text-xl">
            Permapages is a Web3 app that allows users to create and manage
            their own permanent web3 profile and other permaweb pages. When
            connecting to the application with your wallet, you can create your
            Web3 profile by uploading an avatar and entering some social link
            information. Then you can use the editor to create content and add
            permapage widgets to make your profile fun and unique.
          </p>
        </div>
        <div class="mt-16 space-x-4">
          <div class="mb-16 mx-8">
            <div class="text-2xl text-primary">
              Connect your wallet to claim your page on the permaweb
            </div>
          </div>
          <div class="flex justify-center space-x-4">
            {#if $address}
              <a href="/pages" class="btn btn-primary rounded w-[200px]"
                >Pages</a
              >
            {:else}
              <a href="/connect" class="btn btn-primary rounded w-[200px]"
                >Connect Wallet</a
              >
            {/if}
            <a
              target="_blank"
              href="https://permanotes.app/#/notes/WYfC1LPyHJlHrTaN11QS_9-rDMXW0EREqp3FlYKzIWE"
              class="btn btn-outline rounded w-[200px] btn-primary"
              >Learn More</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="hidden md:block absolute bottom-8 left-8">
    <a href="/about">
      <img
        src={window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "ar-dark.png"
          : "ar-light.png"}
        alt="permanent"
      />
    </a>
  </div>
</div>
