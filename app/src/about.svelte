<script>
  import Navbar from "./components/navbar.svelte";
  import { pages } from "./app.js";
  import { gql } from "./services/arweave.js";
  import { marked } from "marked";

  const app = pages({ gql });

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
# Permapages About Page

Permapages is a web3 dapp that allows users to create and manage web3 pages on the permaweb.

Permapages is a Permaweb app inspired by Permanotes, a web3 note platform. The need for web3 to empower users to control and manage their content is real. Permapages aims to fill that need with a user-friendly platform to create personal web3 profile pages and custom web pages without knowing how to code. 

Web3 should permissionless, trustless, and composable, Permapages gives users the power to control and manage
content in a low impact way.

## What is the Permaweb?

The permaweb is an immutable, decentralized web network that puts the power back in the hands of the masses. The permaweb is the only one of its kind, offering incentivisation and information permanence accross a globally distributed network. It's the web you can own and run.

On the permaweb, your voice lives forever. Only when you imagine how the web began and how it has grown to transform our lives, can you fully comprehend the possiblilities of the permaweb.

-- https://arweave.medium.com/welcome-to-the-permaweb-ce0e6c73ddfb

    `)}
    <h2>Permapages Deployment History</h2>
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
