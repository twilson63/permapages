<script>
  import { Route, router } from "tinro";
  import { address } from "./store.js";
  import Announcer from "./components/announcer.svelte";
  import Transition from "./components/transition.svelte";
  import Home from "./home.svelte";
  import Account from "./account.svelte";
  const accountFormP = () => import("./accounts/form.svelte");
  import Notfound from "./404.svelte";
  const aboutP = () => import("./about.svelte");
  import Pages from "./pages/index.svelte";
  const postsP = () => import("./posts/index.svelte");
  const viewPostP = () => import("./pages/posts.svelte");
  // heavy editor screens load on demand, keeping them out of the boot bundle
  const composeP = () => import("./pages/compose.svelte");
  const pageFormP = () => import("./pages/form.svelte");
  const pageLinkP = () => import("./pages/link.svelte");
  const arnsP = () => import("./arns/index.svelte");
  const antP = () => import("./arns/show.svelte");
  const claimP = () => import("./arns/claim.svelte");
  import Preview from "./pages/show.svelte";
  const widgetsSupportP = () => import("./widgets/support.svelte");
  const widgetsBuildP = () => import("./widgets/build.svelte");
  const widgetsHomeP = () => import("./widgets/index.svelte");
  import Dashboard from "./dashboard.svelte";

  import not from "ramda/src/not";
  import isEmpty from "ramda/src/isEmpty";
  const authorPreviewP = () => import("./pages/author-preview.svelte");
  const readerPreviewP = () => import("./pages/reader-preview.svelte");
  const postHistoryP = () => import("./pages/post-history.svelte");

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
        {#await claimP() then m}<svelte:component this={m.default} />{/await}
      </Route>
      <Route path="/:ant">
        {#await antP() then m}<svelte:component this={m.default} />{/await}
      </Route>
      <Route path="/">
        {#await arnsP() then m}<svelte:component this={m.default} />{/await}
      </Route>
      <Route fallback>
        {#await arnsP() then m}<svelte:component this={m.default} />{/await}
      </Route>
    {:else}
      <Home />
    {/if}
  </Route>

  <Route path="/pages/*">
    {#if not(isEmpty($address))}
      <Route path="/compose">
        {#await composeP() then m}<svelte:component this={m.default} />{/await}
      </Route>
      <Route path="/link">
        {#await pageLinkP() then m}<svelte:component this={m.default} />{/await}
      </Route>
      <Route path="/new">
        {#await pageFormP() then m}<svelte:component this={m.default} />{/await}
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
      {#await accountFormP() then m}<svelte:component this={m.default} />{/await}
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
    {#await aboutP() then m}<svelte:component this={m.default} />{/await}
  </Route>
  <Route path="/preview">
    <Preview />
  </Route>
  <Route path="/posts/*">
    {#if not(isEmpty($address))}
      <Route path="/author-preview">
        {#await authorPreviewP() then m}<svelte:component this={m.default} />{/await}
      </Route>
      <Route path="/reader-preview">
        {#await readerPreviewP() then m}<svelte:component this={m.default} />{/await}
      </Route>
      <Route path="/history">
        {#await postHistoryP() then m}<svelte:component this={m.default} />{/await}
      </Route>
      <Route path="/new">
        {#await composeP() then m}<svelte:component this={m.default} />{/await}
      </Route>
      <Route path="/:id/edit" let:meta>
        {#await composeP() then m}<svelte:component this={m.default} id={meta.params.id} />{/await}
      </Route>
      <Route fallback>
        {#await postsP() then m}<svelte:component this={m.default} />{/await}
      </Route>
    {:else}
      <Home />
    {/if}
  </Route>
  <Route path="/widgets">
    {#await widgetsHomeP() then m}<svelte:component this={m.default} />{/await}
  </Route>
  <Route path="/widgets/support">
    {#await widgetsSupportP() then m}<svelte:component this={m.default} />{/await}
  </Route>
  <Route path="/widgets/build">
    {#await widgetsBuildP() then m}<svelte:component this={m.default} />{/await}
  </Route>
  <Route path="/404">
    <Notfound />
  </Route>
</Transition>
