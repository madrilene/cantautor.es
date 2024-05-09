import esbuild from 'esbuild';
import path from 'node:path';

export const jsConfig = eleventyConfig => {
  eleventyConfig.addTemplateFormats('js');

  eleventyConfig.addExtension('js', {
    outputFileExtension: 'js',
    compile: async (content, inputPath) => {
      // Skip processing if not in the designated scripts directories
      if (!inputPath.startsWith('./src/assets/scripts/')) {
        return;
      }

      // Inline scripts processing
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

      // Component scripts processing
      if (inputPath.startsWith('./src/assets/scripts/components/')) {
        const filename = path.basename(inputPath);
        const outputPath = `./dist/assets/components/${filename}`;

        await esbuild.build({
          target: 'es2020',
          entryPoints: [inputPath],
          outfile: outputPath,
          bundle: true,
          minify: false
        });
        return;
      }

      // Default handling for other scripts, excluding inline scripts
      return async () => {
        let output = await esbuild.build({
          target: 'es2020',
          entryPoints: [inputPath],
          bundle: true,
          minify: true,
          write: false
        });

        return output.outputFiles[0].text;
      };
    }
  });
};
