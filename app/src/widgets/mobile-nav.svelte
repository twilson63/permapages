<script>
  import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
  
  export let active = 'intro'

  let showNavBar = false
</script>
<div on:click={() => showNavBar = !showNavBar } class="navbar1_menu-button w-nav-button">
  <div class="menu-icon1">
    <div class="menu-icon1_line-top" style="{showNavBar ? 'transform: translate3d(0px, 8px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(-45deg) skew(0deg, 0deg); transform-style: preserve-3d;' : '' }"></div>
    <div class="menu-icon1_line-middle" style="{showNavBar ? 'width: 0px; height: 2px;' : ''}">
      <div class="menu-icon_line-middle-inner"></div>
    </div>
    <div class="menu-icon1_line-bottom" style="{showNavBar ? 'transform: translate3d(0px, -8px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(45deg) skew(0deg, 0deg); transform-style: preserve-3d;' : ''}"></div>
  </div>
</div>
{#if showNavBar}
<ul class="menu menu-compact lg:menu-normal bg-base-100 w-full"
  transition:scale="{{duration: 500, delay: 500, opacity: 0.5, start: 0.5, easing: quintOut}}"
>
  <li><a class={active === 'intro' ? 'active' : ''} href="/widgets">Intro</a></li>
  <li><a class={active === 'build' ? 'active' : ''} href="/widgets/build">Build</a></li>
  <li><a class={active === 'support' ? 'active' : ''} href="/widgets/support">Support</a></li>
</ul>
{/if}