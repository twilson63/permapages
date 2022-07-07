<script>
  import NavBar from '../components/navbar.svelte'
  // transfer ARNS Test tokens to wallet
</script>
<NavBar />
<main>
  <section>
    <h1>Transfer Tokens</h1>
    <hr />
    <form>
      <div class="form-control">
        <label class="label">Amount</label>
        <input type="number" class="input input-bordered" />
      </div>
      <div class="form-control">
        <label class="label">Target</label>
        <input type="text" class="input input-bordered" />
      </div>
      <div>
        <button class="btn">Submit</button>
      </div>
    </form>
  </section>
</main>
