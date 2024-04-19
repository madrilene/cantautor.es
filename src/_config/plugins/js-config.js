import esbuild from 'esbuild';
import path from 'node:path';

export const jsConfig = eleventyConfig => {
  eleventyConfig.addTemplateFormats('js');

  eleventyConfig.addExtension('js', {
    outputFileExtension: 'js',
    compile: async (content, inputPath) => {
      if (!inputPath.startsWith('./src/assets/scripts/')) {
        return;
      }

      // inline scripts go into the _includes folder
      if (inputPath.startsWith('./src/assets/scripts/inline/')) {
        const filename = path.basename(inputPath);
        const outputFilename = filename.replace(/\.js$/, '-inline.js');
        const outputPath = `./src/_includes/scripts/${outputFilename}`;

        await esbuild.build({
          target: 'es2020',
          entryPoints: [inputPath],
          outfile: outputPath,
          bundle: true,
          minify: true
        });
        return;
      }

      // Default handling for other scripts, excluding inline scripts
      if (!inputPath.startsWith('./src/assets/scripts/inline/')) {
        return async () => {
          let output = await esbuild.build({
            target: 'es2020',
            entryPoints: [inputPath],
            minify: true,
            bundle: true,
            write: false
          });

          return output.outputFiles[0].text;
        };
      }
    }
  });
};
