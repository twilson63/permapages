<script>
  import Copyright from "../widgets/copyright.svelte";
  import NavBar from "../components/navbar.svelte";
  import DemoPost from "../components/demo-post.svelte";
  import PostPreviewHead from "../components/post-preview-head.svelte";
  import PostStamp from "../components/post-stamp.svelte";
</script>

<NavBar />
<main class="container mx-auto min-h-screen">
  <div class="w-full flex mt-8">
    <PostStamp />

    <div class="w-full ml-4">
      <PostPreviewHead />

      <DemoPost />
    </div>
  </div>
</main>
<Copyright />
