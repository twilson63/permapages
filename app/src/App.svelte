<script>
  import { Route, router } from "tinro";
  import { address } from "./store.js";
  import Announcer from "./components/announcer.svelte";
  import Transition from "./components/transition.svelte";
  import Home from "./home.svelte";
  import Connect from "./connect.svelte";
  import Account from "./account.svelte";
  import AccountForm from "./accounts/form.svelte";
  import Notfound from "./404.svelte";
  import About from "./about.svelte";
  import Pages from "./pages/index.svelte";
  import Posts from "./posts/index.svelte";
  import ViewPost from "./pages/posts.svelte";
  import Compose from "./pages/compose.svelte";
  import PageLink from "./pages/link.svelte";
  import PageForm from "./pages/form.svelte";
  import Arns from "./arns/index.svelte";
  import Ant from "./arns/show.svelte";
  import Claim from "./arns/claim.svelte";
  import Preview from "./pages/show.svelte";
  import Widgets from "./widgets.svelte";
  import WidgetsSupport from "./widgets/support.svelte";
  import WidgetsBuild from "./widgets/build.svelte";
  import WidgetsHome from "./widgets/index.svelte";
  import Dashboard from "./dashboard.svelte";

  import not from "ramda/src/not";
  import isEmpty from "ramda/src/isEmpty";
  import AuthorPreview from "./pages/author-preview.svelte";
  import ReaderPreview from "./pages/reader-preview.svelte";
  import PostHistory from "./pages/post-history.svelte";

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
  <Route path="/dashboard">
    <Dashboard />
  </Route>
  <Route path="/arns/*">
    {#if not(isEmpty($address))}
      <Route path="/claim">
        <Claim />
      </Route>
      <Route path="/:ant">
        <Ant />
      </Route>
      <Route path="/">
        <Arns />
      </Route>
      <Route fallback>
        <Arns />
      </Route>
    {:else}
      <Home />
    {/if}
  </Route>

  <Route path="/pages/*">
    {#if not(isEmpty($address))}
      <Route path="/compose">
        <Compose />
      </Route>
      <Route path="/link">
        <PageLink />
      </Route>
      <Route path="/new">
        <PageForm />
      </Route>
      <Route path="/">
        <Pages />
      </Route>
      <Route fallback>
        <Pages />
      </Route>
    {:else}
      <Home />
    {/if}
  </Route>
  <Route path="/account/edit">
    {#if not(isEmpty($address))}
      <AccountForm />
    {:else}
      <Home />
    {/if}
  </Route>
  <Route path="/account">
    {#if not(isEmpty($address))}
      <Account />
    {:else}
      <Home />
    {/if}
  </Route>
  <Route path="/about">
    <About />
  </Route>
  <Route path="/preview">
    <Preview />
  </Route>
  <Route path="/posts/*">
    {#if not(isEmpty($address))}
      <Route path="/author-preview">
        <AuthorPreview />
      </Route>
      <Route path="/reader-preview">
        <ReaderPreview />
      </Route>
      <Route path="/history">
        <PostHistory />
      </Route>
      <Route path="/new">
        <Compose />
      </Route>
      <Route path="/:id/edit" let:meta>
        <Compose id={meta.params.id} />
      </Route>
      <Route fallback>
        <Posts />
      </Route>
    {:else}
      <Home />
    {/if}
  </Route>
  <Route path="/widgets">
    <WidgetsHome />
  </Route>
  <Route path="/widgets/support">
    <WidgetsSupport />
  </Route>
  <Route path="/widgets/build">
    <WidgetsBuild />
  </Route>
  <Route path="/404">
    <Notfound />
  </Route>
</Transition>
