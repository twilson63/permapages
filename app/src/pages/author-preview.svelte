<script>
  import Copyright from "../widgets/copyright.svelte";
  import NavBar from "../components/navbar.svelte";
</script>

<NavBar />
<main class="container mx-auto min-h-screen">
  <div class="w-full flex mt-8">
    <div class="w-[70px] h-[70px] bg-red-500 rounded-full mt-[100px]" />

    <div class="w-full ml-4">
      <div class="w-1/4 flex flex-row items-center">
        <img src="onlyarweave.png" alt="onlyarweave" />
        <div class="ml-4">
          <h3 class="flex flex-row items-center text-lg font-bold">
            <span>@onlyarweave</span>
            <a href="/#/#" class="inline-block ml-2">
              <img src="twitter.svg" alt="twitter" />
            </a>
          </h3>
          <p>Growing the Permaweb.</p>
        </div>
      </div>

      <div class="w-full mt-8 flex flex-row items-center justify-between">
        <div class="">
          <h3 class="text-xl font-bold">Arweave Grow Crew #6</h3>
          <p class="bg-gray-100 text-gray-400 px-6 py-1 rounded-full mt-2">
            August 24, 2022: <a href="/#/#" class="underline hover:no-underline"
              >version 3</a
            >
          </p>
        </div>

        <a href="/#/#"  class="font-semibold bg-gray-100 text-gray-500 inline-block py-2 px-6 rounded-full">View as reader</a>


        <div class="flex flex-row items-center gap-4">
            <a href="/#/#" class="font-semibold text-[#7EBFFF] bg-[#F5FAFF] inline-block py-2 px-6 rounded-full">Update</a>
            <button class="font-semibold py-2 px-6 rounded-full bg-gray-100 text-gray-500">Share</button>
        </div>
      </div>
    </div>
  </div>
</main>
<Copyright />
