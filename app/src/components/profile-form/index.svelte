<script>
  import Tab1 from "./tab1.svelte";
  import Tab2 from "./tab2.svelte";

  let tabs = ["tab1", "tab2", "tab3", "tab4", "tab5", "tab6"];
  $: currentTab = "tab1";

  function next() {
    let i = tabs.indexOf(currentTab);
    currentTab = tabs[++i];
    console.log(currentTab);
  }

  function prev() {
    let i = tabs.indexOf(currentTab);
    currentTab = tabs[--i];
    console.log(currentTab);
  }

  function isActive(t) {
    return currentTab === t;
  }
</script>

<div class="relative h-full">
  <div class="tabs">
    <a class="tab tab-bordered" class:tab-active={currentTab === "tab1"}
      >Profile</a
    >
    <a class="tab tab-bordered" class:tab-active={currentTab === "tab2"}
      >Avatar</a
    >
    <a class="tab tab-bordered" class:tab-active={currentTab === "tab3"}
      >Background Banner</a
    >
    <a class="tab tab-bordered" class:tab-active={currentTab === "tab4"}
      >Web3 Addresses</a
    >
    <a class="tab tab-bordered" class:tab-active={currentTab === "tab5"}
      >Social Links</a
    >
    <a class="tab tab-bordered" class:tab-active={currentTab === "tab6"}
      >Finish</a
    >
  </div>
  {#if currentTab === "tab1"}
    <Tab1 />
  {:else if currentTab === "tab2"}
    <Tab2 />
  {/if}
  <div class="absolute bottom-4 mt-16 space-x-4">
    <button
      on:click={prev}
      class="btn btn-secondary"
      disabled={tabs.indexOf(currentTab) === 0}>Previous</button
    >
    <button
      on:click={next}
      class="btn btn-primary"
      disabled={tabs.indexOf(currentTab) === 5}>Next</button
    >
    <button class="btn btn">Finish</button>
  </div>
</div>
