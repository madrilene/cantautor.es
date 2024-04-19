import Image from '@11ty/eleventy-img';
import path from 'node:path';
import htmlmin from 'html-minifier-terser';

const stringifyAttributes = attributeMap => {
  return Object.entries(attributeMap)
    .map(([attribute, value]) => {
      if (typeof value === 'undefined') return '';
      return `${attribute}="${value}"`;
    })
    .join(' ');
};

export const imageShortcode = async (
  src,
  alt = '',
  caption = '',
  loading = 'lazy',
  className,
  sizes = '90vw',
  widths = [440, 650, 960, 1200],
  formats = ['avif', 'webp', 'jpeg']
) => {
  const metadata = await Image(src, {
    widths: [...widths],
    formats: [...formats],
    urlPath: '/assets/',
    outputDir: './dist/assets/',
    filenameFormat: function (id, src, width, format, options) {
      // Ensure the source path is related to the `src` directory
      const relativePath = path.dirname(src).replace(/^\.\/src\/assets\//, '') + '/';
      const extension = path.extname(src);
      const name = path.basename(src, extension);
      // Formulate the output path without duplicating 'assets'
      return `${relativePath}${name}-${width}w.${format}`;
    }
  });

  const lowsrc = metadata.jpeg[metadata.jpeg.length - 1];

  const imageSources = Object.values(metadata)
    .map(imageFormat => {
      return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat
        .map(entry => entry.srcset)
        .join(', ')}" sizes="${sizes}">`;
    })
    .join('\n');

  const imageAttributes = stringifyAttributes({
    src: lowsrc.url,
    width: lowsrc.width,
    height: lowsrc.height,
    alt,
    loading,
    decoding: 'async'
  });

  const imageElement = caption
    ? `<figure slot="image" class="${className ? `${className}` : ''}">
        <picture>
          ${imageSources}
          <img ${imageAttributes}>
        </picture>
        <figcaption>${caption}</figcaption>
      </figure>`
    : `<picture slot="image" class="${className ? `${className}` : ''}">
        ${imageSources}
        <img ${imageAttributes}>
      </picture>`;

  return htmlmin.minify(imageElement, {collapseWhitespace: true});
};
