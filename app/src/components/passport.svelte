<script>
  import { take, takeLast } from "ramda";
  export let stamps = [];
</script>

<nav class="mt-16 h-[800px] overflow-y-auto rounded">
  <div class="relative">
    <div
      class="z-10 sticky top-0 border-t border-b border-gray-200 bg-gray-50 px-6 py-1 text-sm font-medium text-gray-500"
    >
      <h3>Passport</h3>
    </div>
    <ul role="list" class="relative z-0 divide-y divide-gray-200">
      {#each stamps as stamp}
        <li class="bg-white">
          <div
            class="relative px-6 py-5 flex items-center space-x-3 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
          >
            <div class="flex-shrink-0">
              <img class="h-10 w-10" src="stamp-logo.webp" alt="" />
            </div>
            <div class="flex-1 min-w-0">
              <a href="#" class="focus:outline-none">
                <!-- Extend touch target to entire panel -->
                <span class="absolute inset-0" aria-hidden="true" />
                <p class="text-sm font-medium text-gray-900">
                  {stamp.title}
                </p>
                <a
                  class="text-sm"
                  target="_blank"
                  href="https://arweave.dev/{stamp.id}"
                  >{take(6, stamp.id)}...{takeLast(6, stamp.id)}</a
                >
              </a>
            </div>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</nav>
