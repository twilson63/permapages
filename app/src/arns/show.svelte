<script>
  import NavBar from "../components/navbar.svelte";
  import {
    updateSubDomain,
    removeSubDomain,
    getANT,
  } from "../services/registry.js";
  const ANT = "OofLO5E3LLI1OBsvhrda8BPd8RG-CyNlrExGMpUHxBc";
  // GET /arns/:ant
  // show Ticker, Name, Owner, Controller
  // show Records
  // actions, add, update, remove records
</script>

<NavBar />
<main>
  <section class="hero bg-base-200 min-h-screen items-start">
    <div class="hero-content flex-col lg:flex-row-reverse w-full">
      <div class="flex flex-col space-y-16 w-full">
        <div>
          <div class="flex items-center">
            <div class="flex-1 flex items-center space-x-8">
              <h2 class="text-2xl mb-2">Arweave Name Token (ANT)</h2>
            </div>
          </div>
        </div>
        {#await getANT(ANT) then ant}
          <div>
            <label class="label">Ticker:</label>
            <span>{ant.ticker}</span>
          </div>
          <div>
            <label class="label">Name:</label>
            <span>{ant.name}</span>
          </div>
          <div>
            <h3>Records</h3>
            <table class="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                  <th>TTL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>@</td>
                  <td>1234</td>
                  <td>900</td>
                </tr>
              </tbody>
            </table>
          </div>
        {/await}
      </div>
    </div>
  </section>
</main>
