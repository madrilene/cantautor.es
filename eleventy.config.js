/**
 * Most adjustments must be made in `./src/_config/*`
 */

/**
 * Configures Eleventy with various settings, collections, plugins, filters, shortcodes, and more.
 * Hint VS Code for eleventyConfig autocompletion.
 * © Henry Desroches - https://gist.github.com/xdesro/69583b25d281d055cd12b144381123bf
 * @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig -
 * @returns {Object} -
 */

import yaml from 'js-yaml';

//  config import
import {getAllPosts, onlyMarkdown, tagList} from './src/_config/collections.js';
import events from './src/_config/events.js';
import filters from './src/_config/filters.js';
import plugins from './src/_config/plugins.js';
import shortcodes from './src/_config/shortcodes.js';

export default async function (eleventyConfig) {
  // 	--------------------- Custom Watch Targets -----------------------
  eleventyConfig.addWatchTarget('./src/assets');

  // --------------------- layout aliases
  eleventyConfig.addLayoutAlias('base', 'base.njk');
  eleventyConfig.addLayoutAlias('page', 'page.njk');
  eleventyConfig.addLayoutAlias('artists', 'artists.njk');

  //	---------------------  Collections
  eleventyConfig.addCollection('allPosts', getAllPosts);
  eleventyConfig.addCollection('onlyMarkdown', onlyMarkdown);
  eleventyConfig.addCollection('tagList', tagList);

  // ---------------------  Plugins
  eleventyConfig.addPlugin(plugins.htmlConfig);
  eleventyConfig.addPlugin(plugins.cssConfig);
  eleventyConfig.addPlugin(plugins.jsConfig);

  eleventyConfig.addPlugin(plugins.EleventyRenderPlugin);
  eleventyConfig.addPlugin(plugins.rss);
  eleventyConfig.addPlugin(plugins.syntaxHighlight);

  eleventyConfig.addPlugin(plugins.webc, {
    components: ['./src/_webc/**/*.webc'],
    useTransform: true
  });

  // 	--------------------- Library and Data
  eleventyConfig.setLibrary('md', plugins.markdownLib);
  eleventyConfig.addDataExtension('yaml', contents => yaml.load(contents));

  // --------------------- Filters
  eleventyConfig.addFilter('toIsoString', filters.toISOString);
  eleventyConfig.addFilter('formatDate', filters.formatDate);
  eleventyConfig.addFilter('cssmin', filters.minifyCss);
  eleventyConfig.addNunjucksAsyncFilter('jsmin', filters.minifyJs);
  eleventyConfig.addFilter('splitlines', filters.splitlines);
  eleventyConfig.addFilter('striptags', filters.striptags);
  eleventyConfig.addFilter('toAbsoluteUrl', filters.toAbsoluteUrl);
  eleventyConfig.addFilter('slugify', filters.slugifyString);
  eleventyConfig.addFilter('escapeHtml', filters.escapeHtml);
  eleventyConfig.addFilter('shuffle', filters.shuffle);

  // --------------------- Shortcodes
  eleventyConfig.addShortcode('svg', shortcodes.svgShortcode);
  eleventyConfig.addShortcode('image', shortcodes.imageShortcode);
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

  // --------------------- Events ---------------------

  eleventyConfig.on('eleventy.before', events.createFavicons);

  if (process.env.ELEVENTY_RUN_MODE === 'serve') {
    eleventyConfig.on('eleventy.after', events.svgToJpeg);
  }

  // --------------------- Passthrough File Copy

  // -- same path
  ['src/assets/fonts/', 'src/assets/images/template', 'src/assets/og-images', 'src/assets/**/*.mp3'].forEach(
    path => eleventyConfig.addPassthroughCopy(path)
  );

  eleventyConfig.addPassthroughCopy({
    // -- to root
    'src/assets/images/favicons/*': '/',

    // -- node_modules
    'node_modules/lite-youtube-embed/src/lite-yt-embed.{css,js}': `assets/scripts/components/`
  });

  // --------------------- Build Settings
  eleventyConfig.setDataDeepMerge(true);

  // --------------------- general config
  return {
    htmlTemplateEngine: false,
    markdownTemplateEngine: 'njk',

    dir: {
      output: 'dist',
      input: 'src',
      includes: '_includes',
      layouts: '_layouts'
    }
  };
}
