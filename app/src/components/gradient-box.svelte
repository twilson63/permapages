<script>
  export let link;
</script>

<a
  href={"/#"+"/"+link}
  class="group gradient-box p-[1px] hover:bg-gradient-to-r hover:from-[#FF00E5] hover:to-[#7B55EC] hover:drop-shadow-md "
>
  <div
    class="bg-[#F9F9F9] w-full h-full rounded-3xl p-4 flex flex-col items-center justify-center border"
  >
    <slot />
  </div>
</a>

<style>
  .gradient-box {
    @apply relative bg-white w-[32%] min-h-[200px] rounded-3xl drop-shadow-sm inline-block;
  }
</style>
