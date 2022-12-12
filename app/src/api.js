/**
 * Glue module connecting business logic with services
 * 
 */
import * as app from './app.js'
import { gql } from './services/gql.js'
import { getData, publish } from './services/assets.js'
import { query } from './services/sw-cache.js'

import markdownIt from "markdown-it";
import container from "markdown-it-container";
import attrs from "markdown-it-attrs";

const md = markdownIt({ html: true, linkify: true });

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

const _posts = app.posts({ gql, query, getData, publish, md })

export const posts = {
  list: (addr) => _posts.list(addr).toPromise(),
  get: (id) => _posts.get(id).toPromise(),
  create: (post) => _posts.create(post).toPromise()
}