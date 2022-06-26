<script>
  import { Route, router } from "tinro";
  import { address } from "./store.js";
  import Announcer from "./components/announcer.svelte";
  import Transition from "./components/transition.svelte";
  import Home from "./home.svelte";
  import Connect from "./connect.svelte";
  import Notes from "./notes.svelte";
  import Account from "./account.svelte";
  import Form from "./form.svelte";
  import Show from "./show.svelte";
  import Notfound from "./404.svelte";
  import Topic from "./topic.svelte";
  import Profile from "./profile.svelte";
  import ProfileNotes from "./profile-notes.svelte";
  import About from "./about.svelte";
  import Favorites from "./favorites.svelte";
  import Search from "./search.svelte";
  import Pages from "./pages/index.svelte";
  import PageLink from "./pages/link.svelte";
  import PageForm from "./pages/form.svelte";
  import Arns from "./arns/index.svelte";
  import Preview from "./pages/show.svelte";

  import * as R from "ramda";

  const { not, isEmpty } = R;

  router.mode.hash();
  router.subscribe((_) => window.scrollTo(0, 0));
</script>

<Announcer />
<Transition>
  <Route path="/">
    <Home />
  </Route>
  <Route
    path="/learn"
    redirect="/notes/Xx8lQw1q9xOUn1mB7CMagKHgv8XUy9NxsrQLtfqZItY"
  />
  <Route path="/search">
    <Search />
  </Route>
  <Route path="/connect">
    {#if not(isEmpty($address))}
      <Home />
    {:else}
      <Connect />
    {/if}
  </Route>
  <Route path="/notes/*" firstmatch>
    <Route path="/new">
      {#if not(isEmpty($address))}
        <Form />
      {:else}
        <Connect />
      {/if}
    </Route>
    <Route path="/:id">
      <Show />
    </Route>
    <Route fallback>
      {#if not(isEmpty($address))}
        <Notes />
      {:else}
        <Connect />
      {/if}
    </Route>
  </Route>
  <Route path="/notes/:id/edit">
    <p>TODO</p>
  </Route>
  <Route path="/arns">
    <Arns />
  </Route>
  <Route path="/pages/*">
    {#if not(isEmpty($address))}
      <Route path="/link">
        <PageLink />
      </Route>
      <Route path="/new">
        <PageForm />
      </Route>
      <Route fallback>
        <Pages />
      </Route>
    {:else}
      <Connect />
    {/if}
  </Route>
  <Route path="/account">
    {#if not(isEmpty($address))}
      <Account />
    {:else}
      <Connect />
    {/if}
  </Route>
  <Route path="/profiles/:handle">
    <Profile />
  </Route>
  <Route path="/profiles/:handle/notes">
    <ProfileNotes />
  </Route>
  <Route path="/topics/:topic">
    <Topic />
  </Route>
  <Route path="/favorites">
    <Favorites />
  </Route>
  <Route path="/about">
    <About />
  </Route>
  <Route path="/preview">
    <Preview />
  </Route>
  <Route path="/404">
    <Notfound />
  </Route>
</Transition>
