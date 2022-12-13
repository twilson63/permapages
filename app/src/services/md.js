import markdownIt from "markdown-it";
import container from "markdown-it-container";
import attrs from "markdown-it-attrs";

export const md = markdownIt({ html: true, linkify: true });

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
