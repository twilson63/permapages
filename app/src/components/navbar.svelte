<script>
  let version = __APP_VERSION__.split(".")[2];
</script>

<div class="navbar bg-base-100 container mx-auto">
  <div class="flex-1">
    <a
      href="/"
      class="normal-case txt-gradient  
    font-extrabold text-2xl inline-block tracking-wide">Compose</a
    >
    <div
      class="badge text-xs ml-2 bg-[#F3F5FB] border-none text-black font-semibold"
    >
      BETA {version}
    </div>
  </div>

  <nav class="flex-none">
    <ul class="hidden md:inline-flex gap-2 items-center menu menu-horizontal">
      <li>
        <a href="/#/#">About</a>
      </li>
      <li>
        <a href="/#/#">Dashboard</a>
      </li>
      <li>
        <a href="/#/#">Invite</a>
      </li>
      <li tabindex="0">
        <a href="/#/#">
          Transactions
          <svg
            class="fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            ><path
              d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
            /></svg
          >
        </a>
        <ul class="mt-1 p-2 bg-white border rounded-3xl">
          <li><a href="/#/#">Submenu 1</a></li>
          <li><a href="/#/#">Submenu 2</a></li>
        </ul>
      </li>

      <li>
        <a
          href="/#/#"
          class="group gradient inline-block bg-gradient-to-r from-[#FF00E5] to-[#7B55EC]"
        >
          <div
            class="px-4 py-1 bg-white inline-block rounded-full group-hover:bg-gradient-to-r group-hover:to-[#7B55EC]
             group-hover:from-[#FF00E5]"
          >
            <div class="txt-gradient inline-block group-hover:text-white">Explore Pages</div>
          </div>
        </a>
      </li>
    </ul>
  </nav>
</div>

<style>
  nav ul li a {
    @apply rounded-full px-4 py-2 font-semibold;
  }
  nav ul li a:hover {
    @apply bg-gray-100 shadow-sm;
  }
  nav ul li .gradient {
    @apply p-[2px] drop-shadow-sm;
  }
  nav ul li .gradient:hover {
    @apply p-[2px] drop-shadow-md;
  }
</style>
