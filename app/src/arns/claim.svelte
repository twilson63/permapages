<script>
  import NavBar from '../components/navbar.svelte'
  import { address } from '../store.js'
  // transfer ARNS Test tokens to wallet

  let state = 'new'
  const tweetHREF = addr => {
    const text = encodeURI(
     `I am requesting Arweave Name System tokens to register my permaweb domain! My address is ${addr} 🐘`
    )
    return `https://twitter.com/intent/tweet?text=${text}`
  }

  async function start() {
    try {
    const result = await fetch('https://pilot.ar.io/api/search?address=' + $address)
      .then(res => res.json())
      // kick off process
      state = 'tweet'
    } catch (e) {
      // handle error
      console.log(e) 
    }
  }

  function tweet() {
    state = 'status'
    repeat()
  }

  function repeat() {
    checkStatus = docheckStatus()
    if (state === 'status') {
      setTimeout(repeat, 60 * 60 * 120)
    }
  }

  async function docheckStatus() {
    try {
    const result = await fetch('https://pilot.ar.io/api/enquiry?address=' + $address)
      .then(res => res.json())
      .then(status => {
        if (status.approved) {
          state = 'approved'
        } else if (status.alreadyClaimed) {
          state = 'alreadyClaimed'
        } 
        return status
      })
      return result
    } catch (e) {
      console.log(e)
    }
  }

  

  let checkStatus = docheckStatus()
</script>
<NavBar />
<main>
    <section class="hero bg-base-200 min-h-screen items-start">
      <div class="hero-content flex-col lg:flex-row-reverse w-full">
        <div class="flex flex-col space-y-16 w-full prose prose-lg">
  
            <h1>Claim Test Tokens</h1>
            <p>You're moments away from your very own domain and profile page on the permaweb!
                <br />
                Follow three simple steps:
            </p>
            <ol>
            <li>Start the claim process</li>
            <li>Tweet for verification</li>
            <li>Check status for delivery of your AR and ARNS Test tokens</li>
            </ol>
            <blockquote>It could take up to 15 minutes for the tokens to appear in your wallet </blockquote>
            {#if state === 'new'}
              <button class="btn btn-primary" on:click={start}>Get Started</button>
            {:else if state === 'tweet'}
              <a target="_blank" href="{tweetHREF($address)}" on:click={tweet} class="btn btn-info no-underline">Tweet</a>
            {:else if state === 'approved'}
              <p>Congrats! You are approved! It does take a few minutes for the tokens to be provisioned to your wallet, return to the ARNS Portal.</p>
            {:else if state === 'alreadyClaimed'}
              <p>It appears you may have already claimed tokens!</p>
            {:else}
              {#await checkStatus}
                <p>Checking status every 2 minutes...</p>
              {:then s}
                <h4>Claim Status</h4>
                <p>processed: {s.processed} | approved: {s.approved} | already claimed: {s.alreadyClaimed} </p>
                <p>Checking status every 2 minutes...</p>
              {/await}
            {/if}
            <a href="/arns" class="btn no-underline">Return to ARNS Portal</a>
        </div>

    </section>
</main>