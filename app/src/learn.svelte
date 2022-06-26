<script>
  import Navbar from "./components/navbar.svelte";
</script>

<Navbar />
<main>
  <section
    class="mt-8 text-gray-700 relative w-full px-6 py-12 bg-white shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 md:max-w-3xl md:mx-auto lg:max-w-4xl lg:pt-16 lg:pb-28"
  >
    <h2 class="text-3xl">About</h2>
    <p class="mt-8">
      PermaNotes is a responsive application that provides a permanent storage
      space for every note you can think of creating. This application focuses
      on simplicity and accessibility, so that you can quickly access notes that
      you have created over time.
    </p>
    <h3 class="mt-8 text-xl">Features</h3>
    <div class="flex flex-wrap">
      <div class="card md:w-1/3">
        <div class="card-body">
          <h2 class="card-title">Privacy</h2>
          <p>
            By default, every note you create is private, this means that the
            contents of the note will be encrypted using your wallets private
            key. By encrypting the content, only you will be able to read and
            modify the note.
          </p>
        </div>
      </div>
      <div class="card md:w-1/3">
        <div class="card-body">
          <h2 class="card-title">Sharability</h2>
          <p>
            There are times you may want to share your notes with others. With
            permanotes you can share any note, with any registered user.
          </p>
        </div>
      </div>
      <div class="card md:w-1/3">
        <div class="card-body">
          <h2 class="card-title">Publishability</h2>
          <p>
            Want to share your thoughts with the world, publish your note and
            permanotes will create a public url for you to share.
          </p>
        </div>
      </div>
    </div>
    <h3 class="mt-8 text-xl">Getting Started</h3>
    <p class="mt-8">How do I get started?</p>
    <p class="mt-4">
      PermaNotes is a pay as you go platform, it is important to register, and
      you will need a wallet `ArConnect` with some `AR`. The `AR` is the crypto
      token native to the permaweb, and in order to use any application on the
      permaweb, you need `AR`.
    </p>
    <p>
      After you have your wallet and some AR, you need to <a href="/register"
        >register</a
      >. The registration process will connect your wallet to an account and
      create a set of keys that will be used to encrypt and decrypt your notes.
    </p>
  </section>
</main>
