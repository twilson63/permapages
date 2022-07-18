<script>
import NavBar from './components/navbar.svelte'
import { marked } from 'marked'
import { arweave } from './services/arweave.js'

const note = 'a-r0uxrbuWfBW59aBkrQZjppAY1b-9Q2eqPuK5wsBMQ '

async function getContent() {
  const {data: { content }} = await arweave.api.get(note)
  //console.log(data)
  return marked(content)
}

</script>
<NavBar />
<main>
  <section class="hero bg-base-200 min-h-screen items-start">
    <div class="hero-content flex-col lg:flex-row-reverse w-full">
      <div class="flex w-full justify-center">
        <div class="prose prose-lg">
          {#await getContent()}
            Loading Content...
          {:then content}
            {@html content}
          {/await}
        </div>
      </div>
      
    </div>
  </section>
</main>
