<script>
  import { router } from "tinro";
  import ConnectModal from "./dialogs/connect.svelte";
  import WalletHelp from "./dialogs/help-wallet.svelte";
  import { address } from "./store.js";
  let version = __APP_VERSION__;

  let connectDlg = false;
  let walletHelp = false;
</script>

<svelte:head>
  <title>PermaPages</title>
  <meta
    content="Create your on PermaPage on the Permaweb!"
    name="description"
  />
  <meta content="width=device-width, initial-scale=1" name="viewport" />
  <link href="css/home.css" rel="stylesheet" type="text/css" />
  <style>
    @media (min-width: 992px) {
      html.w-mod-js:not(.w-mod-ix)
        [data-w-id="8e0031be-6d28-482d-5992-47d9f0105010"] {
        opacity: 0;
      }
      html.w-mod-js:not(.w-mod-ix)
        [data-w-id="8e0031be-6d28-482d-5992-47d9f010500e"] {
        opacity: 0;
      }
      html.w-mod-js:not(.w-mod-ix)
        [data-w-id="8e0031be-6d28-482d-5992-47d9f010500f"] {
        opacity: 0;
      }
      html.w-mod-js:not(.w-mod-ix)
        [data-w-id="8e0031be-6d28-482d-5992-47d9f0105011"] {
        opacity: 0;
      }
    }
    @media (max-width: 991px) and (min-width: 768px) {
      html.w-mod-js:not(.w-mod-ix)
        [data-w-id="8e0031be-6d28-482d-5992-47d9f0105010"] {
        opacity: 0;
      }
      html.w-mod-js:not(.w-mod-ix)
        [data-w-id="8e0031be-6d28-482d-5992-47d9f010500e"] {
        opacity: 0;
      }
      html.w-mod-js:not(.w-mod-ix)
        [data-w-id="8e0031be-6d28-482d-5992-47d9f010500f"] {
        opacity: 0;
      }
      html.w-mod-js:not(.w-mod-ix)
        [data-w-id="8e0031be-6d28-482d-5992-47d9f0105011"] {
        opacity: 0;
      }
    }
  </style>
  <!-- [if lt IE 9]><script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js" type="text/javascript"></script><![endif] -->
  <!-- [if lt IE 9]><script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js" type="text/javascript"></script><![endif] -->
  <!-- [if lt IE 9]><script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js" type="text/javascript"></script><![endif] -->
  <!-- [if lt IE 9]><script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js" type="text/javascript"></script><![endif] -->
  <!-- [if lt IE 9]><script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js" type="text/javascript"></script><![endif] -->
  <script type="text/javascript">
    !(function (o, c) {
      var n = c.documentElement,
        t = " w-mod-";
      (n.className += t + "js"),
        ("ontouchstart" in o ||
          (o.DocumentTouch && c instanceof DocumentTouch)) &&
          (n.className += t + "touch");
    })(window, document);
  </script>
  <link href="images/favicon.png" rel="shortcut icon" type="image/x-icon" />
  <link href="images/webclip.png" rel="apple-touch-icon" />
  <!--  Please keep this css code to improve the font quality -->
</svelte:head>
<div class="page-wrapper">
  <div class="global-styles w-embed">
    <style>
      /* Snippet gets rid of top margin on first element in any rich text*/
      .w-richtext > :first-child {
        margin-top: 0;
      }

      /* Snippet gets rid of bottom margin on last element in any rich text*/
      .w-richtext > :last-child,
      .w-richtext ol li:last-child,
      .w-richtext ul li:last-child {
        margin-bottom: 0;
      }

      /* Snippet makes all link elements listed below to inherit color from their parent */
      a,
      .w-tab-link,
      .w-nav-link,
      .w-dropdown-btn,
      .w-dropdown-toggle,
      .w-dropdown-link {
        color: inherit;
      }

      /* Snippet prevents all click and hover interaction with an element */
      .clickable-off {
        pointer-events: none;
      }

      /* Snippet enables all click and hover interaction with an element */
      .clickable-on {
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
      .container-medium,
      .container-small,
      .container-large {
        margin-right: auto !important;
        margin-left: auto !important;
      }

      /*Reset selects, buttons, and links styles*/
      .w-input,
      .w-select,
      a {
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
        -ms-overflow-style: none; // IE 10+
        overflow: -moz-scrollbars-none; // Firefox
      }

      .no-scrollbar::-webkit-scrollbar {
        display: none; // Safari and Chrome
      }
    </style>
  </div>
</div>
<header class="section-header1">
  <div class="page-padding">
    <div class="container-large">
      <div class="padding-vertical padding-xhuge">
        <div class="w-layout-grid header1_component">
          <div class="header1_content">
            <div class="margin-bottom margin-small">
              <h1 class="heading">
                Welcome to PermaPages!
                <span class="badge badge-secondary">
                  BETA {version}
                </span>
              </h1>
            </div>
            <p class="text-size-medium">
              Create and manage your own permanent web3 profile and permaweb
              pages built on Arweave.
            </p>
            <div class="margin-top margin-medium">
              <div class="button-row">
                <button
                  on:click={() => {
                    if ($address) {
                      router.goto("/dashboard");
                    } else {
                      connectDlg = true;
                    }
                  }}
                  class="button w-button"
                  >{$address ? "dashboard" : "connect"}</button
                >

                <a
                  target="_blank"
                  href="https://permanotes.app/#/notes/WYfC1LPyHJlHrTaN11QS_9-rDMXW0EREqp3FlYKzIWE"
                  class="button-secondary w-button">Learn more</a
                >
              </div>
            </div>
          </div>
          <div class="header1_image-wrapper">
            <img
              src="images/permapageslanding.png"
              loading="lazy"
              srcset="images/permapageslanding-p-500.png 500w, images/permapageslanding-p-800.png 800w, images/permapageslanding.png 1080w"
              sizes="(max-width: 479px) 100vw, (max-width: 991px) 90vw, 42vw"
              alt=""
              class="image"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</header>
<div class="section wf-section">
  <div class="how-it-works">
    <div class="container-large">
      <div class="padding-vertical padding-xhuge">
        <div class="home1-howitworks_component">
          <div class="margin-bottom margin-xxlarge">
            <div class="text-align-center">
              <div class="max-width-large">
                <h2 class="heading-xlarge">How it works</h2>
              </div>
            </div>
          </div>
          <div class="margin-bottom margin-large">
            <div class="w-layout-grid home1-howitworks_list">
              <div class="home1-howitworks_item">
                <div class="margin-bottom margin-small">
                  <img
                    src="images/2.png"
                    loading="lazy"
                    srcset="images/2-p-500.png 500w, images/2-p-800.png 800w, images/2.png 1080w"
                    sizes="112px"
                    alt=""
                    class="icon-1x1-custom"
                  />
                </div>
                <div class="margin-bottom margin-small">
                  <h3 class="heading-small">Login with Arweave wallet</h3>
                </div>
                <p>
                  You&#x27;ll need to have <a
                    href="https://arconnect.io"
                    target="_blank"
                    class="link">ArConnect</a
                  >
                  or
                  <a href="https://arweave.app" target="_blank" class="link-2"
                    >Arweave.app</a
                  > wallet credentials to access the app.
                </p>
              </div>
              <div class="home1-howitworks_item">
                <div class="margin-bottom margin-small">
                  <img
                    src="images/3.png"
                    loading="lazy"
                    srcset="images/3-p-500.png 500w, images/3-p-800.png 800w, images/3.png 1080w"
                    sizes="112px"
                    alt=""
                    class="icon-1x1-custom"
                  />
                </div>
                <div class="margin-bottom margin-small">
                  <h3 class="heading-small">Get AR plus ArNS-test tokens</h3>
                </div>
                <p>
                  Go to the <a
                    href="https://ar.io/arns-pilot/"
                    target="_blank"
                    class="link-3">ar.io/arns-pilot</a
                  >
                  (required to get your own custom subdomain).
                </p>
              </div>
              <div class="home1-howitworks_item">
                <div class="margin-bottom margin-small">
                  <img
                    src="images/4.png"
                    loading="lazy"
                    srcset="images/4-p-500.png 500w, images/4-p-800.png 800w, images/4.png 1080w"
                    sizes="112px"
                    alt=""
                    class="icon-1x1-custom"
                  />
                </div>
                <div class="margin-bottom margin-small">
                  <h3 class="heading-small">Publish to the Permaweb</h3>
                </div>
                <p>
                  You can use any <a
                    href="https://xes4hvsfcfy3quzncemofjci5ey3f4dvg4j2bdxhfhvvmgq6.arweave.net/uSXD1kURcbhTLREY4qRI_-6TGy8HU3E6CO5ynrVhoeY"
                    target="_blank"
                    class="link-5">Arweave transaction</a
                  >
                  or
                  <a
                    href="https://be6qty2vygzildvru5f32qkcud2c2pdgfja4bssxlxr4d3gy.arweave.net/CT0J41XBsoWOs-adLvU-FCoPQtPGYqQcDKV1_3jwezY"
                    target="_blank"
                    class="link-6">PermaPage</a
                  > to connect with your subdomain you&#x27;ve claimed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="section-2 wf-section">
  <div class="quote-section">
    <div class="container-large">
      <div class="padding-vertical padding-new">
        <div class="max-width-large align-center" />
      </div>
      <div class="home1-testimonial_component">
        <div class="margin-vertical margin-medium">
          <div class="quote-text">
            &quot;It really is a lot of fun to create pages directly from
            Arweave transactions. NFTs, full websites, you name it. Bringing
            back it to the 90&#x27;s internet, just with a massive difference...
            decentralized Permanence!&quot;
          </div>
        </div>
        <div class="home1-testimonial_client-image-wrapper">
          <img
            src="images/onlyarweave.png"
            loading="lazy"
            srcset="images/onlyarweave-p-500.png 500w, images/onlyarweave-p-800.png 800w, images/onlyarweave.png 869w"
            sizes="64px"
            alt=""
            class="home1-testimonial_client-image"
          />
        </div>
        <p class="name-quote-text">
          <a href="https://only.arweave.dev" target="_blank">only.arweave.dev</a
          >
        </p>
        <p class="paragraph">PermaPages publisher</p>
      </div>
    </div>
  </div>
</div>
<div class="cta-make-page wf-section">
  <div class="cta">
    <div class="container-large-2" />
  </div>
  <section class="section-cta27">
    <div class="cta-make-page">
      <div class="container-small">
        <div class="padding-vertical padding-xhuge">
          <div class="text-align-center">
            <div class="margin-bottom margin-small">
              <h2 class="text-color-white">👀 Make your own PermaPage</h2>
            </div>

            <div class="margin-top margin-medium">
              <div class="button-row-2 is-button-row-center">
                <a href="/pages" class="button-3 w-button"
                  ><strong>Create a page!</strong></a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="cta27_background-image-wrapper">
      <div class="image-overlay-layer" />
      <img
        src="images/placeholder-image.svg"
        loading="lazy"
        alt=""
        class="cta27_background-image"
      />
    </div>
  </section>
</div>
<section class="section-layout87">
  <div class="layout87_background-video-wrapper" />
</section>
<div class="wf-section">
  <div class="page-wrapper-2">
    <div class="global-styles w-embed">
      <style>
        /* Snippet gets rid of top margin on first element in any rich text*/
        .w-richtext > :first-child {
          margin-top: 0;
        }

        /* Snippet gets rid of bottom margin on last element in any rich text*/
        .w-richtext > :last-child,
        .w-richtext ol li:last-child,
        .w-richtext ul li:last-child {
          margin-bottom: 0;
        }

        /* Snippet makes all link elements listed below to inherit color from their parent */
        a,
        .w-tab-link,
        .w-nav-link,
        .w-dropdown-btn,
        .w-dropdown-toggle,
        .w-dropdown-link {
          color: inherit;
        }

        /* Snippet prevents all click and hover interaction with an element */
        .clickable-off {
          pointer-events: none;
        }

        /* Snippet enables all click and hover interaction with an element */
        .clickable-on {
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
        .container-medium,
        .container-small,
        .container-large {
          margin-right: auto !important;
          margin-left: auto !important;
        }

        /*Reset selects, buttons, and links styles*/
        .w-input,
        .w-select,
        a {
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
          -ms-overflow-style: none; // IE 10+
          overflow: -moz-scrollbars-none; // Firefox
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none; // Safari and Chrome
        }
      </style>
    </div>
    <main class="main-wrapper">
      <section class="section-home1-faq">
        <div class="faq">
          <div class="container-small">
            <div class="padding-vertical padding-xhuge">
              <div class="margin-bottom margin-xxlarge">
                <div class="text-align-center">
                  <div class="max-width-large">
                    <div class="margin-bottom margin-small">
                      <h2>Frequently asked questions</h2>
                    </div>
                    <p class="text-size-medium-2">
                      If you need any further details, reach out below!
                    </p>
                  </div>
                </div>
              </div>
              <div class="home1-faq_accordion">
                <div class="collapse collapse-arrow">
                  <input type="checkbox" />
                  <div class="collapse-title">
                    <div class="text-size-medium-2 text-weight-bold">
                      What are all of the steps to get my PermaPage up and
                      running?
                    </div>
                  </div>
                  <div class="collapse-content">
                    <div class="margin-bottom margin-small">
                      <p>
                        We have a few ways for you to get either test tokens or
                        an ANT so you can get started with a friendly subdomain. <br
                        /><br />1). Join the
                        <a href="https://discord.gg/NJwx6NYAeP"
                          ><strong>AR.IO Network Discord Server</strong>.<br
                          />‍<br />2).
                        </a>Go to the #arns-pilot channel. Complete the ArNS
                        Pilot Application through the Appy Bot (The team will
                        respond and supply test ArNS Tokens within 24 hours).
                        <br />‍<br />3).
                        <a href="https://www.youtube.com/watch?v=f-nq1KA0aqE"
                          ><strong>Follow this tutorial</strong></a
                        >, create a personal page and Test ArNS subdomain using
                        <a href="https://pages.arweave.dev">PermaPages.</a>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="collapse collapse-arrow home1-faq_accordion">
                  <input type="checkbox" />
                  <div class="collapse-title home1-faq_question">
                    <div class="text-size-medium-2 text-weight-bold">
                      What&#x27;s the ArNS pilot?
                    </div>
                  </div>
                  <div class="collapse-content home1-faq_answer">
                    <div class="margin-bottom margin-small">
                      <p>
                        We have created the <a
                          href="https://ar.io/arns-pilot/"
                          target="_blank"><strong>ArNS Pilot program</strong></a
                        >, for up to 200 participants to test Smartweave
                        Contracts and a test Arweave Gateway, to help us get
                        everything working properly.This test environment will
                        give no rights to the name you choose through this Pilot
                        or future names on any gateway. However, your help will
                        enable us to make this service great for you and
                        increase the adoption of the PermaWeb
                      </p>
                    </div>
                  </div>
                </div>
                <div class="collapse collapse-arrow home1-faq_accordion">
                  <input type="checkbox" />
                  <div class="collapse-title home1-faq_question">
                    <div class="text-size-medium-2 text-weight-bold">
                      Why do I need a wallet?
                    </div>
                  </div>
                  <div class="collapse-content home1-faq_answer">
                    <div class="margin-bottom margin-small">
                      <p>
                        A wallet is your passport to the web3 <a
                          href="https://arweave.org"
                          target="_blank"><strong>permaweb</strong></a
                        >, it will allow you to manage your keys and keep the
                        private keys secure, and give dApps permission to add
                        data to the decentralized permaweb on your behalf. A
                        wallet is very easy to setup, if you have a modern
                        browser you can visit
                        <a href="https://arconnect.io/"
                          ><strong>https://arconnect.io</strong></a
                        > and click &#x27;download&#x27; then walk through the install
                        instructions.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="collapse collapse-arrow">
                  <input type="checkbox" />
                  <div class="collapse-title home1-faq_question">
                    <div class="text-size-medium-2 text-weight-bold">
                      Where can I see all of the pages created thus far?
                    </div>
                  </div>
                  <div class="collapse-content home1-faq_answer">
                    <div class="margin-bottom margin-small">
                      <p>
                        You can find the growing list of created pages <a
                          href="https://www.onlyarweave.com/all-arns"
                          target="_blank">here</a
                        >.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="collapse collapse-arrow home1-faq_accordion">
                  <input type="checkbox" />
                  <div class="collapse-title home1-faq_question">
                    <div class="text-size-medium-2 text-weight-bold">
                      Why is it important to participate?
                    </div>
                  </div>
                  <div class="collapse-content home1-faq_answer">
                    <div class="margin-bottom margin-small">
                      <p>
                        Be one of the first 200 to get a &#x27;ArNS Beta
                        Tester&#x27; Soulbound Token when the beta ends! Also,
                        this represents a huge opportunity for the Permaweb to
                        be utilized more easily (much easier to find
                        sam.arweave.dev than a long string of transactions. <br
                        /><br />Plus, it&#x27;s actually a lot of fun to put
                        content on the permaweb :).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="margin-top margin-xxlarge">
                <div class="text-align-center">
                  <div class="max-width-medium align-center">
                    <div class="margin-bottom margin-xsmall">
                      <h4 class="heading-small">
                        Have questions or want to share an idea?
                      </h4>
                    </div>
                    <p class="text-size-medium-2">
                      Be in touch, we&#x27;d love to hear from you.
                    </p>
                    <div class="margin-top margin-small">
                      <a
                        href="https://twitter.com/permapages"
                        class="button-secondary-2 w-button">Contact us</a
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer class="footer6_component">
      <div class="page-padding">
        <div class="container-large" />
        <div class="footer4_component">
          <div class="page-padding-2">
            <div class="container-large-2">
              <div class="padding-vertical padding-xxlarge">
                <div class="padding-bottom padding-xxlarge">
                  <div class="w-layout-grid footer4_top-wrapper">
                    <a
                      href="#"
                      id="w-node-_93816162-f910-eb78-0fa4-406d754f988a-e167b7f5"
                      class="footer4_logo-link w-nav-brand"
                      ><img
                        src="images/permapages-logo-footer.svg"
                        loading="lazy"
                        alt=""
                        class="image-3"
                      /></a
                    >
                    <div
                      id="w-node-_93816162-f910-eb78-0fa4-406d754f988c-e167b7f5"
                      class="w-layout-grid footer4_link-list"
                    >
                      <a href="/about" target="_blank" class="footer4_link"
                        >About</a
                      >
                      <a href="/pages" class="footer4_link">Pages</a>
                      <a
                        href="https://ar.io/arns-pilot/"
                        target="_blank"
                        class="footer4_link">Get ArNS Tokens</a
                      >
                      <a
                        href="https://www.arweave.org/"
                        target="_blank"
                        class="footer4_link">Arweave</a
                      >
                      <a href="/widgets" class="footer4_link"
                        >Widgets for Developers</a
                      >
                      <a
                        id="w-node-c61ef7b6-bed1-dc7d-9e80-cafecb572567-e167b7f5"
                        href="/pages"
                        class="button-small-footer w-button">Create a page</a
                      >
                    </div>
                    <div
                      id="w-node-_93816162-f910-eb78-0fa4-406d754f9897-e167b7f5"
                      class="w-layout-grid footer4_social-list"
                    >
                      <a
                        id="w-node-c51544a8-bb6f-3a9b-86bd-91fe22218c1e-e167b7f5"
                        href="https://twitter.com/permapages"
                        target="_blank"
                        class="w-inline-block"
                        ><img
                          src="images/2021-Twitter-logo---white.png"
                          loading="lazy"
                          width="22"
                          srcset="images/2021-Twitter-logo---white-p-500.png 500w, images/2021-Twitter-logo---white-p-800.png 800w, images/2021-Twitter-logo---white.png 1034w"
                          sizes="22px"
                          alt=""
                          class="image-5"
                        /></a
                      >
                      <a
                        id="w-node-c12de1dc-c986-ca2e-b5c2-2ad89720c059-e167b7f5"
                        href="https://u4n5oynk2rn5la52rnkhzxibnyavffuf6o6byt325a4mqklh5wdq.arweave.net/pxvXYarUW9WDuotUfN0BbgFSloXzvBxPeug4yCln7Yc/profile/vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI"
                        target="_blank"
                        class="w-inline-block"
                        ><img
                          src="images/metaweave_dark-transparent.png"
                          loading="lazy"
                          width="30"
                          alt=""
                          class="image-4"
                        /></a
                      >
                    </div>
                  </div>
                </div>
                <div class="padding-top padding-medium">
                  <div class="w-layout-grid footer4_bottom-wrapper">
                    <div
                      id="w-node-_93816162-f910-eb78-0fa4-406d754f98a3-e167b7f5"
                      class="footer4_credit-text"
                    >
                      &copy; 2022 PermaPages. All right reserved.
                    </div>
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
    </footer>
  </div>
</div>

<ConnectModal bind:open={connectDlg} on:help={() => (walletHelp = true)} />
<WalletHelp bind:open={walletHelp} />

<!-- [if lte IE 9]><script src="https://cdnjs.cloudflare.com/ajax/libs/placeholders/3.0.2/placeholders.min.js"></script><![endif] -->
