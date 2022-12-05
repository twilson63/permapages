<script>
  let blockchain = "matic"; //selected blockchain value
  let blockchains = [
    {
      name: "Ethereum",
      value: "eth",
      icon: "eth-logo.png",
    },
    {
      name: "Solana",
      value: "sol",
      icon: "sol-logo.png",
    },
    {
      name: "Polygon",
      value: "matic",
      icon: "polygon-logo.png",
    },
  ];
</script>

<div class="w-4/5 border shadow-sm p-4 rounded-3xl mt-4">
  <p class="text-gray-500">
    You can pay and upload any content to the Permaweb by using wallets on the
    following chains <span class="text-xs">(select to connect)</span>.
  </p>

  <div class="flex flex-row items-center gap-2 justify-center mt-2">
    {#each blockchains as item}
      <div>
        <input
          on:change={(e) => (blockchain = e.target.value)}
          checked={blockchain === item.value}
          type="radio"
          name="blockchain"
          id={item.value}
          value={blockchain}
          class="peer sr-only"
        />

        <label
          for={item.value}
          class="cursor-pointer peer-checked:bg-gradient-to-r peer-checked:from-[#FF00E5] peer-checked:to-[#7B55EC]
             bg-white rounded-full w-[45px] h-[45px] inline-block flex justify-center items-center peer-checked:drop-shadow-md"
        >
          <img
            src={item.icon}
            alt={item.name}
            width="40px"
            class="drop-shadow-md"
          />
        </label>
      </div>
    {/each}
  </div>
</div>

<style>
  input[type="radio"]:checked + label {
    position: relative;
  }
  input[type="radio"]:checked + label::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: -10;
    width: 12px;
    height: 5px;
    border-radius: 50%;
    background: linear-gradient(90deg, #ff00e5 0%, #7b55ec 100%);
  }
</style>
