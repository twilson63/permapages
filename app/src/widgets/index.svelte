<script>
  let watchVideo = false
</script>
<svelte:head>
  <title>Permapages Widgets - Build</title>
  <meta
    content="Learn how to build permapage widgets"
    name="description"
  />
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
    <div data-collapse="medium" data-animation="default" data-duration="400" data-w-id="1907f46e-a90e-11ad-1498-a92c908156fe" data-easing="ease" data-easing2="ease" role="banner" class="navbar1_component w-nav">
      <div class="navbar1_container">
        <a href="#" class="navbar1_logo-link w-nav-brand"></a>
        <nav role="navigation" class="navbar1_menu w-nav-menu">
          <a href="/widgets" aria-current="page" class="navbar1_link w-nav-link w--current">Intro</a>
          <a href="/widgets/build" class="navbar1_link w-nav-link">Build</a>
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
    <header class="section-home5-header">
      <div class="page-padding-3">
        <div class="container-large-2">
          <div class="padding-vertical padding-xhuge">
            <div class="home5-header_component">
              <div class="margin-bottom margin-xxlarge">
                <div class="text-align-center">
                  <div class="max-width-large">
                    <div class="margin-bottom margin-small">
                      <h1 class="heading-home">Introducing <span class="text-span-2">widgets</span>.<br>Made for builders like you.</h1>
                    </div>
                    <p class="text-size-medium-main">Permapages now enables developers to extend dynamic functionality. <br>Get your dApp front and center via widgets. <br></p>
                    <div class="margin-top margin-medium">
                      <div class="button-row-2 is-button-row-center">
                        <a href="#" class="button w-button">Get started</a>
                        <a href="/widgets/build" class="button-2 w-button">Learn more</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {#if watchVideo}
              <div class="home5-header_lightbox w-inline-block w-lightbox">
                <iframe class="embedly-embed" src="//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2Fhie-VyMtqd4%3Ffeature%3Doembed&display_name=YouTube&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dhie-VyMtqd4&image=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fhie-VyMtqd4%2Fhqdefault.jpg&key=96f1f04c5f4143bcb0f2e68c87d65feb&type=text%2Fhtml&schema=youtube" width="940" height="528" scrolling="no" title="YouTube embed" frameborder="0" allow="autoplay; fullscreen" allowfullscreen="true"></iframe>
              </div>
              {:else}
              <a href="#" on:click|preventDefault={() => watchVideo = true } class="home5-header_lightbox w-inline-block w-lightbox"><img src="images/intro-to-widgets.png" loading="lazy" srcset="images/intro-to-widgets.png 500w, images/intro-to-widgets.png 800w, images/intro-to-widgets.png 1080w, images/intro-to-widgets.png 1600w, images/intro-to-widgets.png 1920w" sizes="(max-width: 991px) 90vw, 100vw" alt="" class="home5-header_lightbox-image" /></a>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </header>
    <section class="section-home5-features-video">
      <div class="page-padding-3">
        <div class="container-large-2">
          <div class="padding-xhuge">
            <div class="w-layout-grid home5-features-video_component">
              <a href="#" class="home5-features-video_lightbox w-inline-block w-lightbox">
                <img src="images/PoAP-Arweave.png" loading="lazy" srcset="images/PoAP-Arweave-p-500.png 500w, images/PoAP-Arweave-p-800.png 800w, images/PoAP-Arweave.png 1000w" sizes="(max-width: 767px) 90vw, (max-width: 991px) 43vw, 41vw" alt="" class="large-sq-image-home" />
              </a>
              <div class="home5-features-video_content">
                <div class="margin-bottom margin-xsmall">
                  <div class="text-weight-semibold-3">Where your dApp can shine</div>
                </div>
                <div class="margin-bottom margin-small">
                  <h2 class="heading-6">Why widgets?</h2>
                </div>
                <p class="text-size-medium-2">Builders can leverage widgets to aggregate resources and information that may change over time, converting a static web presence to a dynamic view of information. <br><br>Essentially, you can make any page come alive.</p>
                <div class="margin-top margin-medium">
                  <div class="button-row-2">
                    <a href="/widgets/build" class="button-link with-icon w-inline-block">
                      <div>Get the details to build</div>
                      <div class="icon-embed-xxsmall w-embed"><svg width="16" height="16" viewbox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 3L11 8L6 13" stroke="CurrentColor" stroke-width="1.5"></path>
                        </svg></div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="padding-vertical padding-xhuge-big">
            <div class="w-layout-grid home5-features-video_component">
              <div class="home5-features-video_content">
                <div class="margin-bottom margin-xsmall">
                  <div class="text-weight-semibold-3">The tools required to make it happen</div>
                </div>
                <div class="margin-bottom margin-small">
                  <h2 class="heading-6">How can I create a widget?</h2>
                </div>
                <p class="text-size-medium-2">Arweave is a friendly place for all developers. Even if you have never built on web3 before, you can create a widget with some basic development skills (HTML, Javascript, CSS).</p>
                <div class="margin-top margin-medium">
                  <div class="button-row-2">
                    <a href="/widgets/build" class="button-link with-icon w-inline-block">
                      <div>Start building</div>
                      <div class="icon-embed-xxsmall w-embed"><svg width="16" height="16" viewbox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 3L11 8L6 13" stroke="CurrentColor" stroke-width="1.5"></path>
                        </svg></div>
                    </a>
                  </div>
                </div>
              </div>
              <a href="#" class="home5-features-video_lightbox w-inline-block w-lightbox"><img src="images/building-widgets.png" loading="lazy" srcset="images/building-widgets-p-500.png 500w, images/building-widgets-p-800.png 800w, images/building-widgets.png 1000w" sizes="(max-width: 767px) 90vw, (max-width: 991px) 43vw, 41vw" alt="" class="large-sq-image-home">
                <script type="application/json" class="w-json">{
"items": [],
"group": ""
}</script>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section-home5-pricing">
      <div class="page-padding-3">
        <div class="container-large-2">
          <div class="padding-vertical padding-xhuge">
            <div class="margin-bottom margin-xxlarge is-tablet-medium">
              <div class="max-width-large">
                <div class="margin-bottom margin-xsmall">
                  <div class="text-weight-semibold-2">Build the future</div>
                </div>
                <div class="margin-bottom margin-small">
                  <h2 class="heading-7">What can you do with <span class="text-span-3">widgets</span>?</h2>
                </div>
              </div>
            </div>
            <div class="w-layout-grid home5-pricing_component">
              <div class="home5-pricing_content">
                <div class="w-layout-grid home5-pricing_content-list">
                  <div id="w-node-_7dc56a57-e3db-164b-34c9-8492e1fe3a79-c3a095a8" class="home5-pricing_content-item">
                    <div class="home5-pricing_item-text-wrapper">
                      <div class="margin-bottom margin-xsmall">
                        <h4 class="heading-xsmall"><span class="text-span-4">🏞 Show an NFT gallery</span></h4>
                      </div>
                      <p>Create an easy way for anyone to show their Arweave-based NFTs. Imagine connecting with Metaplex, ArDrive, Koii, ArtByCity and more.</p>
                    </div>
                  </div>
                  <div id="w-node-_7dc56a57-e3db-164b-34c9-8492e1fe3a82-c3a095a8" class="home5-pricing_content-item">
                    <div class="home5-pricing_item-text-wrapper">
                      <div class="margin-bottom margin-xsmall">
                        <h4 class="heading-xsmall"><span class="text-span-5">📽 Create a media experience</span></h4>
                      </div>
                      <p>Source podcast episodes, audio, and film to be easily displayed on any PermaPage.</p>
                    </div>
                  </div>
                  <div id="w-node-_7dc56a57-e3db-164b-34c9-8492e1fe3a8b-c3a095a8" class="home5-pricing_content-item">
                    <div class="home5-pricing_item-text-wrapper">
                      <div class="margin-bottom margin-xsmall">
                        <h4 class="heading-xsmall"><span class="text-span-6">📊 Show detailed actions</span></h4>
                      </div>
                      <p>Capture and display anything from profile views, page update history, recently favorited items... you name it. </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="home-box">
                <div class="home5-pricing_plan-content">
                  <div class="home5-pricing_content-top">
                    <div class="home5-pricing_top-left">
                      <div class="margin-bottom margin-xxsmall">
                        <div class="heading-small-new">Ideas to build</div>
                      </div>
                      <div>What will you imagine?</div>
                    </div>
                  </div>
                  <div class="home5-pricing_divider"></div>
                  <div>Concepts:</div>
                  <div class="home5-pricing_feature-list">
                    <div id="w-node-_7dc56a57-e3db-164b-34c9-8492e1fe3aa6-c3a095a8" class="home5-pricing_feature">
                      <div class="home5-pricing_icon-wrapper"><img src="images/icon_check.svg" loading="lazy" alt="" class="icon-1x1-xsmall"></div>
                      <div class="text-block-concepts">&quot;Buy me a coffee&quot; function.</div>
                    </div>
                    <div id="w-node-_7dc56a57-e3db-164b-34c9-8492e1fe3aab-c3a095a8" class="home5-pricing_feature">
                      <div class="home5-pricing_icon-wrapper"><img src="images/icon_check.svg" loading="lazy" alt="" class="icon-1x1-xsmall"></div>
                      <div class="text-block-concepts">Featured projects and repo&#x27;s.</div>
                    </div>
                    <div id="w-node-_7dc56a57-e3db-164b-34c9-8492e1fe3ab0-c3a095a8" class="home5-pricing_feature">
                      <div class="home5-pricing_icon-wrapper"><img src="images/icon_check.svg" loading="lazy" alt="" class="icon-1x1-xsmall"></div>
                      <div class="text-block-concepts">List of PoAPs of visited sites.</div>
                    </div>
                    <div id="w-node-_7dc56a57-e3db-164b-34c9-8492e1fe3ab5-c3a095a8" class="home5-pricing_feature">
                      <div class="home5-pricing_icon-wrapper"><img src="images/icon_check.svg" loading="lazy" alt="" class="icon-1x1-xsmall"></div>
                      <div class="text-block-concepts">Most recent PermaNotes.</div>
                    </div>
                    <div id="w-node-_7dc56a57-e3db-164b-34c9-8492e1fe3aba-c3a095a8" class="home5-pricing_feature">
                      <div class="home5-pricing_icon-wrapper"><img src="images/icon_check.svg" loading="lazy" alt="" class="icon-1x1-xsmall"></div>
                      <div class="text-block-concepts">Featured podcasts via Permacast.</div>
                    </div>
                    <div id="w-node-_7dc56a57-e3db-164b-34c9-8492e1fe3abf-c3a095a8" class="home5-pricing_feature">
                      <div class="home5-pricing_icon-wrapper"><img src="images/icon_check.svg" loading="lazy" alt="" class="icon-1x1-xsmall"></div>
                      <div class="text-block-concepts">Custom PermaPage templates.</div>
                    </div>
                    <div id="w-node-_7dc56a57-e3db-164b-34c9-8492e1fe3ac4-c3a095a8" class="home5-pricing_feature">
                      <div class="home5-pricing_icon-wrapper"><img src="images/icon_check.svg" loading="lazy" alt="" class="icon-1x1-xsmall"></div>
                      <div class="text-block">Custom profile views.</div>
                    </div>
                    <div id="w-node-_7dc56a57-e3db-164b-34c9-8492e1fe3ac9-c3a095a8" class="home5-pricing_feature">
                      <div class="home5-pricing_icon-wrapper"><img src="images/icon_check.svg" loading="lazy" alt="" class="icon-1x1-xsmall"></div>
                      <div class="text-block-concepts">Wallet transactions.</div>
                    </div>
                  </div>
                  <div class="home5-pricing_divider"></div>
                  <a href="/widgets/build" class="button-4 max-width-full w-button">Get started</a>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                      <div id="w-node-cb5a6e0f-00f4-dcb7-83b5-9905374b7ddb-c3a095a8" class="footer4_credit-text">© 2022 PermaPages. All right reserved.</div>
                      <!--
                      <a href="#" class="footer4_legal-link">Privacy Policy</a>
                      <a href="#" class="footer4_legal-link">Terms of Service</a>
                      -->
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