<script>
  let version = __APP_VERSION__;

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/pages", label: "Pages" },
    { href: "/posts", label: "Posts" },
    { href: "/arns", label: "Domains" },
    { href: "/account", label: "Account" },
  ];
</script>

<header class="border-b border-base-300 bg-base-100">
  <div class="navbar container mx-auto px-4">
    <div class="flex-1 items-baseline gap-3">
      <a href="/" class="wordmark text-2xl">PermaPages</a>
      <span
        class="hidden sm:inline-block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-base-content/50"
        >v{version}</span
      >
    </div>

    <nav class="flex-none" aria-label="Primary">
      <ul class="hidden md:flex items-center gap-1">
        {#each links as link}
          <li>
            <a
              href={link.href}
              class="rounded-full px-4 py-2 text-sm font-medium text-base-content/80 hover:bg-base-200 hover:text-base-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >{link.label}</a
            >
          </li>
        {/each}
      </ul>

      <!-- compact menu for small screens -->
      <details class="dropdown dropdown-end md:hidden">
        <summary class="btn btn-ghost btn-sm rounded-full px-3" aria-label="Open menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round" />
          </svg>
        </summary>
        <ul
          class="dropdown-content menu mt-2 w-44 rounded-xl border border-base-300 bg-base-100 p-2 shadow-lg z-40"
        >
          {#each links as link}
            <li><a href={link.href}>{link.label}</a></li>
          {/each}
        </ul>
      </details>
    </nav>
  </div>
</header>
