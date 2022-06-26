<script>
  import Navbar from "./components/navbar.svelte";
  import { notes } from "./app.js";
  import { gql } from "./services/arweave.js";
  import { marked } from "marked";

  const app = notes({ gql });

  async function getDeploys() {
    const results = await app.history();
    return results;
  }
</script>

<Navbar />
<main>
  <section
    class="mt-8 text-base-600 relative w-full px-6 py-12 bg-base-200 shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 md:max-w-3xl md:mx-auto lg:max-w-4xl lg:pt-16 lg:pb-28 prose prose-lg"
  >
    {@html marked(`
# Permanotes About Page

Permanotes is a web 3 application fully hosted on the Permaweb. 


## What is the Permaweb?

The permaweb is an immutable, decentralized web network that puts the power back in the hands of the masses. The permaweb is the only one of its kind, offering incentivisation and information permanence accross a globally distributed network. It's the web you can own and run.

On the permaweb, your voice lives forever. Only when you imagine how the web began and how it has grown to transform our lives, can you fully comprehend the possiblilities of the permaweb.

-- https://arweave.medium.com/welcome-to-the-permaweb-ce0e6c73ddfb

## Permanotes

Permanotes is a protocol and an app that lives on the Permaweb and gives users the ability to create, store and share markdown notes. These notes are documents that will be stored on the Permaweb forever. You can choose to keep the note private and Permanotes uses your Arweave wallet to encrypt the note so that only your wallet can decrypt the note. You can also choose to share your note to the public, in which the Permaweb will keep the note unecrypted and you can leverage a url to provide to your friends and post on your social media accounts.

    `)}
    <h2>Permaweb Deployment History</h2>
    <h3>Deployments</h3>
    {#await getDeploys() then deploys}
      <ul>
        {#each deploys as deploy}
          <li>
            <a href="https://arweave.net/{deploy.id}"
              >https://arweave.net/{deploy.id}</a
            >
          </li>
        {/each}
        <li>
          <a
            href="https://arweave.net/kM1efxk-CDDxPRkMc3H6ZdarlBfEjwWCTF6YwNVM34s"
          >
            https://arweave.net/kM1efxk-CDDxPRkMc3H6ZdarlBfEjwWCTF6YwNVM34s
          </a>
        </li>
        <li>
          <a
            href="https://arweave.net/LLHwK0yqZ4oo3UpfbdjmgUp6D_toIO9Mxub_ofREhEI"
          >
            https://arweave.net/LLHwK0yqZ4oo3UpfbdjmgUp6D_toIO9Mxub_ofREhEI
          </a>
        </li>
      </ul>
    {/await}
    <hr />
    <div class="flex items-center justify-center">
      <a href="/" class="btn btn-primary no-underline">Home</a>
    </div>
  </section>
</main>
