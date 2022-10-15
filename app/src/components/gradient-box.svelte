<script>
  export let title;
  export let subtitle;
  export let icons;
  export let link;
</script>

<a
  href={"/#" + "/" + link}
  class="group gradient-box p-[1px] hover:bg-gradient-to-r hover:from-[#FF00E5] hover:to-[#7B55EC] hover:drop-shadow-md "
>
  <div
    class="bg-[#F9F9F9] w-full h-full rounded-3xl p-4 flex flex-col items-center justify-center border"
  >
    <h4
      class="text-[#7D7D7D] group-hover:bg-gradient-to-r group-hover:to-[#7B55EC] group-hover:from-[#FF00E5] group-hover:text-transparent
  group-hover:bg-clip-text text-2xl font-semibold mb-4"
    >
      {title}
    </h4>

    <div class="flex items-center gap-4">
      {#each icons as icon}
        <svelte:component this={icon} />
      {/each}
    </div>

    <p
      class="opacity-[0] group-hover:opacity-[1] group-hover:bg-gradient-to-r group-hover:to-[#7B55EC] 
  group-hover:from-[#FF00E5] group-hover:text-transparent group-hover:bg-clip-text mt-4 text-xs"
    >
      {subtitle}
    </p>
  </div>
</a>

<style>
  .gradient-box {
    @apply relative bg-white w-[32%] min-h-[270px] rounded-3xl drop-shadow-sm inline-block;
  }
</style>
