import markdownIt from "markdown-it";
import container from "markdown-it-container";
import attrs from "markdown-it-attrs";

export const md = markdownIt({ html: true, linkify: true });

/**
 * Turn on compose-time syntax highlighting. Code is highlighted once, when
 * the author renders/publishes, so published pages carry pre-highlighted
 * markup and need zero JS to paint. highlight.js loads lazily — only in
 * the editor, never in the published page or the app shell.
 */
export async function enableCodeHighlight(instance = md) {
  const { default: hljs } = await import("highlight.js");
  instance.set({
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
        } catch (e) { /* fall through to no highlighting */ }
      }
      return "";
    },
  });
  return instance;
}

md.use(container, "info", {
  validate: function (params) {
    return params.trim().match(/^(info|success|warning|error)+$/);
  },
  render: function (tokens, idx) {
    var m = tokens[idx].info.trim().match(/^(.*)+$/);
    if (tokens[idx].nesting === 1) {
      return `<div class="my-2 py-2 alert alert-${m[1]} block prose-p:block dark:prose-strong:text-black prose-code:rounded-full prose-code:bg-black prose-code:px-[8px] prose-code:py-[4px] prose-code:text-white prose-code:p-0 prose-code:m-0 prose-code:mt-[3px]">`;
    } else {
      return "</div>";
    }
  },
});

md.use(attrs);
