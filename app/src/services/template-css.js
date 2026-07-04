/**
 * The stylesheet inlined into every published page and post.
 *
 * Published pages are permanent documents — the design is typography-first,
 * self-contained (no external fonts, no CDNs, no JS), and small enough to
 * inline (~10KB) so a page paints in one round trip and stays inside the
 * free-dispatch budget.
 *
 * Legacy daisyUI theme names are honored: each maps to a curated
 * ink-and-paper palette via CSS variables on [data-theme].
 */

const themes = {
  // name: [paper, ink, accent, muted-paper]  (+d marks a dark palette)
  light: ['#fdfdfb', '#1d2129', '#1a5fb4', '#f1f0ec'],
  corporate: ['#ffffff', '#181a2a', '#2563eb', '#eef1f5'],
  cupcake: ['#faf7f5', '#291334', '#c26097', '#f0eaf6'],
  bumblebee: ['#fffdf5', '#333016', '#b8860b', '#f6f2dd'],
  emerald: ['#f8fdf9', '#13351f', '#0f7a4d', '#e6f3ea'],
  garden: ['#f9fbf6', '#26301b', '#4d7c0f', '#ecf2e3'],
  lofi: ['#ffffff', '#000000', '#000000', '#f2f2f2'],
  pastel: ['#fbfaff', '#3b3654', '#7c6fbd', '#efecf8'],
  fantasy: ['#fdfbff', '#2d1b4e', '#6d28d9', '#f1eafa'],
  wireframe: ['#ffffff', '#333333', '#333333', '#eeeeee'],
  cmyk: ['#ffffff', '#1a1a1a', '#0891b2', '#edf6f9'],
  autumn: ['#fbf5f0', '#3d2417', '#a1490f', '#f3e7db'],
  acid: ['#fcfcf9', '#1c1a20', '#7bab00', '#eef3d8'],
  lemonade: ['#fdfced', '#2a2a10', '#8a9a00', '#f4f2d1'],
  winter: ['#f8fafd', '#21274a', '#3457d5', '#e9eef7'],
  retro: ['#f4ecdf', '#3a2f24', '#b45309', '#eadfca'],
  valentine: ['#fdf4f7', '#4a1631', '#be3970', '#f7e1ea'],
  cyberpunk: ['#fff824', '#1a1608', '#c923b1', '#f4ea3a'],
  dark: ['#15171c', '#d8dae0', '#7ba9e8', '#1e2128', 'd'],
  black: ['#000000', '#d4d4d4', '#ffffff', '#141414', 'd'],
  luxury: ['#14100c', '#dcd3c2', '#c8a24b', '#1e1913', 'd'],
  dracula: ['#282a36', '#f8f8f2', '#ff79c6', '#323442', 'd'],
  business: ['#1d232a', '#c9cdd3', '#5c9ead', '#252c34', 'd'],
  night: ['#0f1729', '#c7cede', '#5a8bd6', '#182238', 'd'],
  coffee: ['#211720', '#d9c8b4', '#b3762f', '#2b1f2a', 'd'],
  forest: ['#171a17', '#c8d1c5', '#4f9e6b', '#20241f', 'd'],
  halloween: ['#1b1816', '#d9d3c8', '#e2711d', '#262220', 'd'],
  synthwave: ['#1a103d', '#d8d1f0', '#e779c1', '#241856', 'd'],
  aqua: ['#12374d', '#cbe4f0', '#3fc1e8', '#1a4560', 'd']
}

const themeVars = Object.entries(themes).map(([name, [paper, ink, accent, muted, dark]]) =>
  `[data-theme="${name}"]{--paper:${paper};--ink:${ink};--accent:${accent};--muted:${muted};--dim:${dark ? '75%' : '55%'};color-scheme:${dark ? 'dark' : 'light'}}`
).join('\n')

export const PAGE_CSS = `
:root{--paper:#fdfdfb;--ink:#1d2129;--accent:#1a5fb4;--muted:#f1f0ec;--dim:55%;color-scheme:light}
@media (prefers-color-scheme:dark){:root{--paper:#15171c;--ink:#d8dae0;--accent:#7ba9e8;--muted:#1e2128;--dim:75%;color-scheme:dark}}
${themeVars}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--ink);
 font-family:'Iowan Old Style','Palatino Linotype',Palatino,Georgia,'Times New Roman',serif;
 font-size:1.0625rem;line-height:1.65;text-rendering:optimizeLegibility}
img,video{max-width:100%;height:auto}
main{min-height:100vh}

/* ---- prose: the reading column ---- */
.prose{max-width:68ch;margin:0 auto;padding:3rem 1.25rem 4rem}
.prose h1,.prose h2,.prose h3,.prose h4{line-height:1.2;letter-spacing:-.01em;margin:2.2em 0 .5em;font-weight:650}
.prose h1{font-size:2.1rem;margin-top:1.2em}
.prose h2{font-size:1.55rem}
.prose h3{font-size:1.25rem}
.prose h4{font-size:1.05rem;text-transform:uppercase;letter-spacing:.06em}
.prose p,.prose ul,.prose ol{margin:0 0 1.1em}
.prose li{margin:.3em 0}
.prose a{color:var(--accent);text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px}
.prose a:hover{text-decoration-thickness:2px}
.prose blockquote{margin:1.6em 0;padding:.1em 0 .1em 1.2em;border-left:3px solid var(--accent);font-style:italic;color:color-mix(in srgb,var(--ink) 85%,var(--paper))}
.prose hr{border:0;margin:2.6em auto;text-align:center}
.prose hr::after{content:"\\25C6";display:block;font-size:.65rem;color:var(--accent);letter-spacing:1em;padding-left:1em}
.prose table{border-collapse:collapse;width:100%;margin:1.4em 0;font-size:.95em}
.prose th,.prose td{border-bottom:1px solid color-mix(in srgb,var(--ink) 18%,var(--paper));padding:.45em .6em;text-align:left}
.prose th{font-family:system-ui,sans-serif;font-size:.8em;text-transform:uppercase;letter-spacing:.05em}
.prose figure{margin:1.6em 0}
.prose figcaption{font-family:system-ui,sans-serif;font-size:.8rem;color:color-mix(in srgb,var(--ink) var(--dim),var(--paper));text-align:center;margin-top:.5em}

/* ---- code ---- */
.prose code{font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:.88em;background:var(--muted);padding:.15em .4em;border-radius:4px}
.prose pre{background:var(--muted);border-radius:8px;padding:1rem 1.2rem;overflow-x:auto;line-height:1.5;margin:1.4em 0}
.prose pre code{background:none;padding:0;font-size:.85rem}
.hljs-comment,.hljs-quote{color:color-mix(in srgb,var(--ink) 55%,var(--paper));font-style:italic}
.hljs-keyword,.hljs-selector-tag,.hljs-section,.hljs-name{color:var(--accent);font-weight:600}
.hljs-string,.hljs-attr,.hljs-symbol,.hljs-addition{color:color-mix(in srgb,var(--accent) 60%,var(--ink))}
.hljs-number,.hljs-literal,.hljs-built_in{color:color-mix(in srgb,var(--accent) 75%,var(--ink))}
.hljs-title,.hljs-function{font-weight:600}
.hljs-deletion{text-decoration:line-through}

/* ---- markdown alert containers ---- */
.alert{font-family:system-ui,sans-serif;font-size:.92rem;margin:1.4em 0;padding:.8em 1em;border-radius:6px;background:var(--muted);border-left:4px solid var(--accent)}
.alert-success{border-left-color:#2e8b57}
.alert-warning{border-left-color:#c07f00}
.alert-error{border-left-color:#c0392b}

/* ---- widget drawer (CSS-only) ---- */
.drawer{position:relative}
.drawer-toggle{position:absolute;appearance:none;opacity:0;height:2.6rem;width:2.6rem;right:1rem;top:1rem;cursor:pointer;z-index:30}
.drawer-toggle::before{content:"\\25C6"}
.drawer-button{position:absolute;right:1rem;top:1rem;z-index:20;font-family:system-ui,sans-serif;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);border:1px solid var(--accent);border-radius:999px;padding:.45em .9em;cursor:pointer;background:var(--paper)}
.drawer-button svg{width:1rem;height:1rem;vertical-align:-2px}
.drawer-side{position:fixed;inset:0 0 0 auto;width:min(20rem,90vw);background:var(--muted);transform:translateX(100%);transition:transform .2s ease;overflow-y:auto;z-index:40;padding:1rem;box-shadow:-4px 0 24px rgba(0,0,0,.18)}
.drawer-toggle:checked~.drawer-side{transform:none}
.drawer-overlay{display:none}
.drawer-toggle:checked~.drawer-side .drawer-overlay{display:block;position:fixed;inset:0;z-index:-1}
.menu{list-style:none;margin:0;padding:0;font-family:system-ui,sans-serif}
.menu li{margin:1rem 0}
@media (prefers-reduced-motion:reduce){.drawer-side{transition:none}}

/* ---- cards / media widgets ---- */
.card{background:var(--muted);border-radius:10px;overflow:hidden;font-family:system-ui,sans-serif}
.card figure{margin:0}
.card-body{padding:1rem 1.2rem}
.card-title{margin:.2em 0;font-size:1.05rem}
.card-actions{display:flex;justify-content:flex-end;gap:.5rem}
.carousel{display:flex;gap:1rem;overflow-x:auto;scroll-snap-type:x mandatory;padding:.5rem 0}
.carousel>*{scroll-snap-align:start;flex:0 0 auto}
.btn,a.btn{display:inline-block;font-family:system-ui,sans-serif;font-size:.85rem;letter-spacing:.04em;color:var(--paper);background:var(--accent);border:0;border-radius:999px;padding:.55em 1.2em;text-decoration:none;cursor:pointer}
.mask-circle{border-radius:50%;object-fit:cover}

/* ---- byline (posts) ---- */
.byline{display:flex;align-items:center;gap:.8rem;font-family:system-ui,sans-serif;margin:1.5rem 0 2.5rem}
.byline img{width:44px;height:44px;border-radius:50%;object-fit:cover}
.byline .name{font-weight:600;font-size:.95rem}
.byline .date{font-size:.8rem;color:color-mix(in srgb,var(--ink) var(--dim),var(--paper))}

/* ---- footer ---- */
.footer{font-family:system-ui,sans-serif;font-size:.85rem;margin-top:4rem;padding:2rem 1.25rem 3rem;background:var(--muted);display:flex;flex-wrap:wrap;gap:2rem;justify-content:center;align-items:center}
.footer a{color:var(--accent);text-decoration:none}
.footer a.btn{color:var(--paper)}
.footer a:hover{text-decoration:underline}
.footer-title{display:block;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-size:.72rem;margin-bottom:.4em;color:color-mix(in srgb,var(--ink) var(--dim),var(--paper))}
.footer img{max-height:40px}

/* ---- small utility shims used by existing templates ---- */
.flex{display:flex}.flex-col{flex-direction:column}.flex-1{flex:1}.flex-none{flex:none}
.items-center{align-items:center}.justify-end{justify-content:flex-end}.justify-start{justify-content:flex-start}
.grid{display:grid}.w-full{width:100%}.mx-auto{margin-inline:auto}.float-right{float:right}
.text-xs{font-size:.75rem}.text-lg{font-size:1.1rem}.text-2xl{font-size:1.4rem}.text-3xl{font-size:1.7rem}.font-bold{font-weight:700}
`
