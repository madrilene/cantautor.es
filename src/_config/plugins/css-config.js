/**
 * CSS as first-class citizen in Eleventy
 * Credits:
 * - Vadim Makeev - https://pepelsbey.dev/articles/eleventy-css-js/
 */

import postcss from 'postcss';
import postcssImport from 'postcss-import';
import postcssImportExtGlob from 'postcss-import-ext-glob';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

// : https://pepelsbey.dev/articles/eleventy-css-js/

export const cssConfig = eleventyConfig => {
  eleventyConfig.addTemplateFormats('css');

  eleventyConfig.addExtension('css', {
    outputFileExtension: 'css',
    compile: async (content, path) => {
      if (path !== './src/assets/css/global.css') {
        return;
      }

      return async () => {
        let output = await postcss([
          postcssImportExtGlob,
          postcssImport,
          tailwindcss,
          autoprefixer,
          cssnano
        ]).process(content, {
          from: path
        });

        return output.css;
      };
    }
  });
};
