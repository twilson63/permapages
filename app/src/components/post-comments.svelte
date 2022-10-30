<script>
    export let filteredcomments;
</script>

<div class="w-full">
  {#each filteredcomments as comment}
    {#if comment.author}
      <div class="flex items-center">
        <button>
          <img src="./response-arrow.png" alt="Respond" />
          <span>{comment.ups}</span>
        </button>

        <div class="w-full mt-7">
          <p class="text-sm leading-6 bg-gray-50 w-fit px-4 py-1 rounded-full">
            {comment.comment}
          </p>

          <div class="w-full flex items-center mt-4">
            <div class="w-auto flex items-center">
              <div class="flex items-center">
                <img src={comment.avtar} alt={comment.name} width="40px" />
                <div class="ml-4 text-xs">
                  <p>
                    {comment.date} responded to:
                    <a href="/#/#" class="underline hover:no-underline"
                      >{"version " + comment.version}</a
                    >
                  </p>
                  <span>{comment.name}</span>
                </div>
              </div>

              <span
                class="ml-10 border py-1 px-6 text-sm rounded-3xl bg-[#F7F7F7] border-none"
                >Author</span
              >
            </div>

            <button
              class="ml-auto border py-2 px-8 rounded-3xl bg-[#F7F7F7] border-none hover:text-black"
              >Reply</button
            >
          </div>
        </div>
      </div>
      {#if comment.replies.length > 0}
        {#each comment.replies as reply}
          <div class="w-full flex flex-col mt-4">
            <div class="flex items-center w-fit ml-auto">
              <button class="flex flex-col items-center mr-2">
                <img src="./arrow-up.svg" alt="arrow-up" width="18px" />
                <span class="text-[#2CBE46]">{reply.ups}</span>
              </button>
              <span class="">{reply.comment}</span>
            </div>

            <div class="flex items-center gap-4 w-fit ml-auto mt-2">
              <div class="text-xs text-right">
                <p>
                  {reply.date} responded to:
                  <a href="/#/#" class="underline hover:no-underline"
                    >{"version " + reply.version}</a
                  >
                </p>
                <span class="">{reply.name} (walletid)</span>
              </div>
              <img src={reply.avtar} alt={reply.name} width="40px" />
            </div>
          </div>
        {/each}
      {/if}
    {:else}
      <div class="flex items-center">
        <button>
          <img src="./response-arrow.png" alt="Respond" />
          <span>{comment.ups}</span>
        </button>

        <div class="w-full mt-6">
          <p class="text-sm leading-6">
            {comment.comment}
          </p>

          <div class="w-full flex items-center mt-4">
            <div class="w-auto flex items-center">
              <div class="flex items-center">
                <img src={comment.avtar} alt={comment.name} width="40px" />
                <div class="ml-4 text-xs">
                  <p>
                    {comment.date} responded to:
                    <a href="/#/#" class="underline hover:no-underline"
                      >{"version " + comment.version}</a
                    >
                  </p>
                  <span>{comment.name}</span>
                </div>
              </div>
            </div>

            <button
              class="ml-auto border py-2 px-8 rounded-3xl bg-[#F7F7F7] border-none hover:text-black"
              >Reply</button
            >
          </div>
        </div>
      </div>

      {#if comment.replies.length > 0}
        {#each comment.replies as reply}
          <div class="w-full flex flex-col mt-4">
            <div class="flex items-center w-fit ml-auto">
              <button class="flex flex-col items-center mr-2">
                <img src="./arrow-up.svg" alt="arrow-up" width="18px" />
                <span class="text-[#2CBE46]">{reply.ups}</span>
              </button>
              <span class="">{reply.comment}</span>
            </div>

            <div class="flex items-center gap-4 w-fit ml-auto mt-2">
              <div class="text-xs text-right">
                <p>
                  {reply.date} responded to:
                  <a href="/#/#" class="underline hover:no-underline"
                    >{"version " + reply.version}</a
                  >
                </p>
                <span class="">{reply.name} (walletid)</span>
              </div>
              <img src={reply.avtar} alt={reply.name} width="40px" />
            </div>
          </div>
        {/each}
      {/if}
    {/if}
  {/each}
</div>
