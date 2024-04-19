import {toISOString, formatDate} from './filters/dates.js';
import {minifyCss, minifyJs} from './filters/minify.js';
import {splitlines} from './filters/splitlines.js';
import {striptags} from './filters/striptags.js';
import {toAbsoluteUrl} from './filters/to-absolute-url.js';
import {slugifyString} from './filters/slugify.js';
import {escapeHtml} from './filters/escape-html.js';

export default {
  toISOString,
  formatDate,
  minifyCss,
  minifyJs,
  splitlines,
  striptags,
  toAbsoluteUrl,
  slugifyString,
  escapeHtml
};
