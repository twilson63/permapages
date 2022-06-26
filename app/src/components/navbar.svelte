<script>
  import { router } from "tinro";
  import { address, account } from "../store.js";
  import * as R from "ramda";

  let version = __APP_VERSION__.split(".")[2];
</script>

<div class="navbar bg-base-100 max-w-full">
  <div class="md:hidden dropdown">
    <label tabindex="0" class="btn mask mask-circle">
      {#if $account && $account.profile}
        <img
          src={`https://arweave.net/${$account.profile.avatar}`}
          alt="avatar"
          width="48"
          heigth="48"
        />
      {:else}
        <img
          class="bg-base-100"
          src="logo.svg"
          alt="menu"
          width="48"
          height="48"
        />
      {/if}
    </label>
    <ul
      tabindex="0"
      class="dropdown-content menu p-2 shadow bg-base-100 rounded-box md:w-52"
    >
      <li>
        <a href="/notes/La7xUTN13SFI58-tVKSFQznRzHKY3QfVblYhV-6J-2A">Learn</a>
      </li>
      {#if R.isEmpty($address)}
        <li><a href="/arns">ArNS</a></li>
        <li><a href="/connect">Connect</a></li>
      {:else}
        <li><a href="/pages">Pages</a></li>
        <li><a href="/arns">ArNS</a></li>
        <li><a href="/account">Account</a></li>
      {/if}
    </ul>
  </div>
  <div class="flex-1">
    <a href="/" class="btn btn-ghost normal-case text-xl">🐘 PERMAPAGES</a>
    <div class="badge badge-secondary">ALPHA {version}</div>
  </div>
  <div class="flex-none">
    <ul class="hidden md:inline-flex menu menu-horizontal p-0">
      <li>
        <a href="/notes/Xx8lQw1q9xOUn1mB7CMagKHgv8XUy9NxsrQLtfqZItY">Learn</a>
      </li>
      {#if R.isEmpty($address)}
        <li><a href="/arns">ArNS</a></li>
        <li><a href="/connect">Connect</a></li>
      {:else}
        <li><a href="/pages">Pages</a></li>
        <li><a href="/arns">ArNS</a></li>
        <li><a href="/account">Account</a></li>
      {/if}
    </ul>
  </div>
</div>
