<script>
  import hljs from "highlight.js";
  import { onMount } from "svelte";
  
  let watchVideo = false 

  onMount(() => hljs.highlightAll())


</script>
<svelte:head>
  <title>Permapages Widgets - Build</title>
  <meta
    content="Learn how to build permapage widgets"
    name="description"
  />
  <link href="github-dark.css" rel="stylesheet" type="text/css" />
  <link href="css/widgets.css" rel="stylesheet" type="text/css" />
  <style>
    * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

    body {
      background-color: #f8f8f8;
    }
  </style>
</svelte:head>

<div data-collapse="medium" data-animation="default" data-duration="400" data-w-id="80358d73-3c52-6d7e-70ff-472fee424d84" data-easing="ease" data-easing2="ease" role="banner" class="navbar1_component w-nav">
  <div class="navbar1_container-mobile">
    <a href="#" class="navbar1_logo-link w-nav-brand"></a>
    <nav role="navigation" class="navbar1_menu w-nav-menu">
      <a href="/widgets" class="navbar1_link w-nav-link">Intro</a>
      <a href="/widgets/build" aria-current="page" class="navbar1_link w-nav-link w--current">Build</a>
      <a href="/widgets/support" class="navbar1_link w-nav-link">Support</a>
    </nav>
    <div class="navbar1_menu-button w-nav-button">
      <div class="menu-icon1">
        <div class="menu-icon1_line-top"></div>
        <div class="menu-icon1_line-middle">
          <div class="menu-icon_line-middle-inner"></div>
        </div>
        <div class="menu-icon1_line-bottom"></div>
      </div>
    </div>
  </div>
</div>
<div class="page-wrapper-2">
  <div class="global-styles w-embed">
    <style>
/* Snippet gets rid of top margin on first element in any rich text*/
.w-richtext>:first-child {
margin-top: 0;
}
/* Snippet gets rid of bottom margin on last element in any rich text*/
.w-richtext>:last-child, .w-richtext ol li:last-child, .w-richtext ul li:last-child {
  margin-bottom: 0;
}
/* Snippet makes all link elements listed below to inherit color from their parent */
a, 
.w-tab-link,
.w-nav-link,
.w-dropdown-btn,
.w-dropdown-toggle,
.w-dropdown-link
{
color: inherit;
}
/* Snippet prevents all click and hover interaction with an element */
.clickable-off {
pointer-events: none;
}
/* Snippet enables all click and hover interaction with an element */
.clickable-on{
pointer-events: auto;
}
/* Snippet enables you to add class of div-square which creates and maintains a 1:1 dimension of a div.*/
.div-square::after {
content: "";
display: block;
padding-bottom: 100%;
}
/*Hide focus outline for main content element*/
  main:focus-visible {
  outline: -webkit-focus-ring-color auto 0px;
}
/* Make sure containers never lose their center alignment*/
.container-medium, .container-small, .container-large {
margin-right: auto !important;
margin-left: auto !important;
}
/*Reset selects, buttons, and links styles*/
.w-input, .w-select, a {
color: inherit;
text-decoration: inherit;
font-size: inherit;
}
/*Apply "..." after 3 lines of text */
.text-style-3lines {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
/* Apply "..." after 2 lines of text */
.text-style-2lines {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
/* Apply "..." at 100% width */
.truncate-width { 
  width: 100%; 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
}
/* Removes native scrollbar */
.no-scrollbar {
  -ms-overflow-style: none;  // IE 10+
  overflow: -moz-scrollbars-none;  // Firefox
}
.no-scrollbar::-webkit-scrollbar {
  display: none; // Safari and Chrome
}
</style>
  </div>
  <main class="main-wrapper">
    <header class="section-home5-header">
      <div class="page-padding-3">
        <div class="container-large-2">
          <div class="padding-vertical padding-xhuge">
            <div class="home5-header_component">
              <div class="margin-bottom margin-xxlarge">
                <div class="text-align-center">
                  <div class="max-width-large">
                    <div class="margin-bottom margin-small">
                      <h1 class="heading-home">Build <span class="text-span-2-new">widgets</span>.<br></h1>
                    </div>
                    <p class="text-size-medium-main">Permapages now enables developers to extend dynamic functionality. <br>Get your dApp front and center of a fresh audience. <br></p>
                  </div>
                </div>
              </div>
              {#if watchVideo}
              <div class="home5-header_lightbox w-inline-block w-lightbox">
                <iframe class="embedly-embed" src="//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FlS-hYDI4AnM%3Ffeature%3Doembed&display_name=YouTube&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DlS-hYDI4AnM&image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FlS-hYDI4AnM%2Fhqdefault.jpg&key=8dbccd19d8504533ba8c8c7bf03fedca&type=text%2Fhtml&schema=youtube" width="940" height="528" scrolling="no" title="YouTube embed" frameborder="0" allow="autoplay; fullscreen" allowfullscreen="true"></iframe>
              </div>
              {:else}
              <a href="#" on:click|preventDefault={() => watchVideo = true} class="home5-header_lightbox w-inline-block w-lightbox"><img src="images/widget_workshop-1.png" loading="lazy" srcset="images/widget_workshop-1.png 500w, images/widget_workshop-1.png 800w, images/widget_workshop-1.png 1080w, images/widget_workshop-1.png 1600w, images/widget_workshop-1.png 1920w" sizes="(max-width: 991px) 90vw, 100vw" alt="" class="home5-header_lightbox-image" />
                
              </a>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </header>
    <section class="section-home5-features-image">
      <div class="page-padding-3">
        <div class="container-large-2"></div>
      </div>
    </section>
    <section class="section-home5-features-video">
      <div class="page-padding-3">
        <div class="container-large-2">
          <div class="padding-vertical">
            <div class="w-layout-grid dev-guy-block">
              <a href="#/widgets/build" class="home5-features-video_lightbox w-inline-block w-lightbox">
                <img src="images/code-guy-1.png" loading="lazy" srcset="images/code-guy-1.png 500w, images/code-guy-1.png 1000w" sizes="100vw" alt="" class="large-sq-image-home" />
              </a>
              <div class="home5-features-video_content">
                <div class="margin-bottom margin-small">
                  <h2 class="heading-6">The basics</h2>
                </div>
                <p class="text-size-medium-2">A widget is a bundled “ESM” javascript file that is added to the HTML page when Permapages generates the web page with a target “div” element with a unique “id” for rendering.</p>
                <div class="mockup-code my-4">
                  <pre class="px-4"><code class="language-html">
{`<div id=”hello-world”></div>
<script defer type=”module” src=”https://w-hello.arweave.dev”></script>
                    `}
                  </code></pre>
                </div>
                <p class="text-size-medium-2">
                  Source code of https://w-hello.arweave.dev or https://arweave.net/XXXXXXXXXX
                </p>
                <div class="mockup-code my-4">
                  <pre class="px-4"><code class="language-js">
{`var el = document.getElementById("hello-world")
el.innerHTML = "<h2 class=”text-primary”>Hello World</h2>"
                    `}
                  </code></pre>
                </div>
                
                <div class="margin-top margin-medium">
                  <div class="button-row-2">
                    <a href="#" class="button-link with-icon w-inline-block">
                      <div>Go to the workshop doc</div>
                      <div class="icon-embed-xxsmall w-embed"><svg width="16" height="16" viewbox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 3L11 8L6 13" stroke="CurrentColor" stroke-width="1.5"></path>
                        </svg></div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="w-layout-grid dev-tools">
              <div class="home5-features-video_content">
                <div class="margin-bottom margin-xsmall">
                  <div class="text-weight-semibold-3">Make it easy to build your widget</div>
                </div>
                <div class="margin-bottom margin-small">
                  <h2 class="heading-6">Tools for rapid dev</h2>
                </div>
                <p class="text-size-medium-2">Every Permapage, by default, loads the following libraries for programmatic access:<br>‍<br>• TailwindCSS (Atomic CSS using classes) - <a href="https://tailwindcss.com/"><strong>https://tailwindcss.com<br>• </strong></a>DaisyUI (CSS Components built on TailwindCSS) - <a href="https://daisyui.com/"><strong>https://daisyui.com <br>• </strong></a>Arweave SDK (Access to the permaweb) <br>• Arweave JS - <a href="https://github.com/arweaveteam/arweave-js"><strong>https://github.com/arweaveteam/arweave-js<br>• </strong></a>Warp SDK (Arweave Smart Contract Access) - <a href="https://warp.cc/"><strong>https://warp.cc<br><br>‍</strong></a>You may use these libraries as you build your widget, or you can import your own libraries using ESM Modules. <strong><em>NOTE: If you import external libraries, it is important to use permanent links to those libraries<br><br>‍</em></strong>TailwindCSS and DaisyUI are available as HTML class names within your markup, for example, if you wanted to create a <strong>badge</strong> component within your Widget, you would use the following HTML <strong>&lt;div class=&quot;badge badge-primary&quot;&gt;My Badge&lt;/div&gt;<br><br>‍</strong>Arweave is available on the <strong>window</strong> object as <strong>arweave</strong> Warp is available on the <strong>window</strong> object as <strong>warp</strong>Using these libraries you have the power to create rich user experiences with minimal code. <br><br>TailwindCSS and DaisyUI give you a clean presentation framework to manage the look and feel of your widget and Arweave and Warp give you powerful interaction libraries with Arweave Data and Smartweave Contracts.</p>
                <div class="margin-top margin-medium">
                  <div class="button-row-2">
                    <a href="#" class="button-link with-icon-green w-inline-block">
                      <div>Start building</div>
                      <div class="icon-embed-xxsmall w-embed"><svg width="16" height="16" viewbox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 3L11 8L6 13" stroke="CurrentColor" stroke-width="1.5"></path>
                        </svg></div>
                    </a>
                  </div>
                </div>
              </div>
              <a href="#" class="home5-features-video_lightbox w-inline-block w-lightbox"><img src="images/dev-tooling-arweave.png" loading="lazy" srcset="images/dev-tooling-arweave.png 500w, images/dev-tooling-arweave.png 800w, images/dev-tooling-arweave.png 1000w" sizes="100vw" alt="" class="large-sq-image-home">
                <script type="application/json" class="w-json">{
"items": [],
"group": ""
}</script>
              </a>
            </div>
            <div class="rich-text-block w-richtext">
              <h2>How to publish your widget 🚀</h2>
              <p>The easiest and cheapest way to publish your widget is to use the <strong>@bundlr-network/client</strong> to deploy your code as a transaction to Arweave with metadata, which will allow Permapages to locate the Widget and show it in the Permapages editor.</p>
              <p>An Arweave Transactions consists of the <strong>data</strong> and <strong>tags</strong>; the data should be the bundled javascript, and the tags will identify your transaction as a widget.</p>
              <h3>Tags</h3>
              <figure style="max-width:1596px" class="w-richtext-align-fullwidth w-richtext-figure-type-image">
                <div><img src="images/wiget-details-ss.png" loading="lazy" alt=""></div>
              </figure>
              
              <p><strong>‍</strong>Deploy Widget Example,</p>
              <div class="mockup-code mb-4">
                <pre class="px-4"><code class="language-js">
                  {`
import Bundlr from '@bundlr-network/client';
import assert from 'assert';
import fs from 'fs'

const walletFile = process.argv[2]

assert(walletFile, 'Wallet required!')

try {
  const jwk = JSON.parse(fs.readFileSync(walletFile).toString());

  const bundlr = new Bundlr.default("http://node2.bundlr.network", 
      "arweave", jwk);

  const data = fs.readFileSync('./dist/widget.js')

  const tags = [
    {name: 'Content-Type', value: 'application/javascript'},
    {name: 'App-Name', value: 'Permapage-Widget'},
    {name: 'App-Version', value: '0.0.0'},
    {name: 'Widget-Id', value: 'widget-id' },
    {name: 'Widget-Name', value: 'widget-name'},
    {name: 'Widget-Desc', value: 'A description'},
    {name: 'Widget-Docs', 
          value: 
              'https://permanotes.app/#/notes/' +
                'uwzAOorYh2cYTHG9YQJFS9hSLI3erYMa7N9L4NndWOI'
        }
  ]

  const tx = await bundlr.createTransaction(data, { tags })
  await tx.sign()
  const result = await tx.upload()

  console.log('Deployed!')

  console.log('TransactionId: ', result.data.id)
} catch (e) {
  console.log('ERROR: ', e.message)
}
`}
                </code></pre>
              </div>
              <!--
              <p>import Bundlr from &#x27;@bundlr-network/client&#x27;;import assert from &#x27;assert&#x27;;import fs from &#x27;fs&#x27;const walletFile = process.argv[2]assert(walletFile, &#x27;Wallet required!&#x27;)try {  const jwk = JSON.parse(fs.readFileSync(walletFile).toString());  const bundlr = new Bundlr.default(&quot;http://node2.bundlr.network&quot;,       &quot;arweave&quot;, jwk);  const data = fs.readFileSync(&#x27;./dist/widget.js&#x27;)  const tags = [    {name: &#x27;Content-Type&#x27;, value: &#x27;application/javascript&#x27;},    {name: &#x27;App-Name&#x27;, value: &#x27;Permapage-Widget&#x27;},    {name: &#x27;App-Version&#x27;, value: &#x27;0.0.0&#x27;},    {name: &#x27;Widget-Name&#x27;, value: &#x27;widget-name&#x27;},    {name: &#x27;Widget-Desc&#x27;, value: &#x27;A description&#x27;},    {name: &#x27;Widget-Docs&#x27;,           value:               &#x27;https://permanotes.app/#/notes/&#x27; +                &#x27;uwzAOorYh2cYTHG9YQJFS9hSLI3erYMa7N9L4NndWOI&#x27;        }  ]  const tx = await bundlr.createTransaction(data, { tags })  await tx.sign()  const result = await tx.upload()  console.log(&#x27;Deployed!&#x27;)  console.log(&#x27;TransactionId: &#x27;, result.data.id)} catch (e) {  console.log(&#x27;ERROR: &#x27;, e.message)}</p>
              -->
              <p>You are publishing your Widget to the permaweb for the Widget to be discoverable within the Permapage application. Users can select the Widget from a list of widgets and add your Widget to their page.</p>
              <blockquote><strong><em>NOTE: you can publish your widget for free using BundlrClient </em></strong>
                <a href="https://github.com/Bundlr-Network/js-client"><strong><em>https://github.com/Bundlr-Network/js-client</em></strong></a>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
      <section class="section-cta5">
        <div class="page-padding-4">
          <div class="container-large-2"></div>
          <section class="section-cta25">
            <div class="page-padding-5">
              <div class="container-small">
                <div class="padding-vertical padding-xhuge">
                  <div class="text-align-center">
                    <div class="margin-bottom margin-small">
                      <h2>Complete the workshop</h2>
                    </div>
                    <p class="text-size-medium-3">Get your widget into the wild.</p>
                    <div class="margin-top margin-medium">
                      <div class="button-row-3 is-button-row-center">
                        <a href="#" class="button-cta w-button">Go to widget workshop docs</a>
                        <a href="#" class="button-3 w-button">Visit PermaPages</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div class="cta5_background-video-wrapper">
          <div class="video-overlay-layer"></div>
          <div data-video-urls="" data-autoplay="true" data-loop="true" data-wf-ignore="true" data-beta-bgvideo-upgrade="false" class="cta5_background-video w-background-video w-background-video-atom"><video id="4cbbdf8e-6e00-2242-d92c-44a4793e162e-video" autoplay="" loop="" muted="" playsinline="" data-wf-ignore="true" data-object-fit="cover"></video></div>
        </div>
      </section>
    </section>
    <section class="section-home5-testimonial">
      <div class="page-padding-3">
        <div class="container-large-2"></div>
      </div>
    </section>
    <section class="section-home5-pricing">
      <div class="page-padding-3">
        <div class="container-large-2"></div>
        <div class="page-padding">
          <div class="container-large"></div>
          <div class="footer4_component">
            <div class="page-padding-2">
              <div class="container-large-2">
                <div class="padding-vertical padding-xxlarge">
                  <div class="padding-bottom padding-xxlarge">
                    <div class="w-layout-grid footer4_top-wrapper">
                      <a href="#" id="w-node-cb5a6e0f-00f4-dcb7-83b5-9905374b7dc7-c3a095a8" class="footer4_logo-link w-nav-brand"><img src="images/permapages-logo-footer.svg" loading="lazy" alt="" class="image-3"></a>
                      <div id="w-node-cb5a6e0f-00f4-dcb7-83b5-9905374b7dc9-c3a095a8" class="w-layout-grid footer4_link-list">
                        <a href="https://permanotes.app/#/notes/WYfC1LPyHJlHrTaN11QS_9-rDMXW0EREqp3FlYKzIWE" target="_blank" class="footer4_link">Learn More</a>
                        <a href="/pages" class="footer4_link">Pages</a>
                        <a href="https://pilot.ar.io" target="_blank" class="footer4_link">Get ArNS Tokens</a>
                        <a href="https://www.arweave.org/" target="_blank" class="footer4_link">Arweave</a>
                        <a id="w-node-cb5a6e0f-00f4-dcb7-83b5-9905374b7dd2-c3a095a8" href="/pages" class="button-small-footer w-button">Create a page</a>
                      </div>
                      <div id="w-node-cb5a6e0f-00f4-dcb7-83b5-9905374b7dd4-c3a095a8" class="w-layout-grid footer4_social-list">
                        <a id="w-node-cb5a6e0f-00f4-dcb7-83b5-9905374b7dd5-c3a095a8" href="https://twitter.com/permapages" target="_blank" class="w-inline-block"><img src="images/2021-Twitter-logo---white.png" loading="lazy" width="22" srcset="images/2021-Twitter-logo---white-p-500.png 500w, images/2021-Twitter-logo---white-p-800.png 800w, images/2021-Twitter-logo---white.png 1034w" sizes="22px" alt="" class="image-5"></a>
                        <a id="w-node-cb5a6e0f-00f4-dcb7-83b5-9905374b7dd7-c3a095a8" href="https://u4n5oynk2rn5la52rnkhzxibnyavffuf6o6byt325a4mqklh5wdq.arweave.net/pxvXYarUW9WDuotUfN0BbgFSloXzvBxPeug4yCln7Yc/profile/vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI" target="_blank" class="w-inline-block"><img src="images/metaweave_dark-transparent.png" loading="lazy" width="30" alt="" class="image-4"></a>
                      </div>
                    </div>
                  </div>
                  <div class="padding-top padding-medium">
                    <div class="w-layout-grid footer4_bottom-wrapper">
                      <div id="w-node-cb5a6e0f-00f4-dcb7-83b5-9905374b7ddb-6ad8d8d5" class="footer4_credit-text">© 2022 PermaPages. All right reserved.</div>
                      <a href="#" class="footer4_legal-link">Privacy Policy</a>
                      <a href="#" class="footer4_legal-link">Terms of Service</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</div>