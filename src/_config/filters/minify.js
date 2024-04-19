import CleanCSS from 'clean-css';
import esbuild from 'esbuild';

const minifyCss = code => new CleanCSS({}).minify(code).styles;

const minifyJs = async (code, ...rest) => {
  const callback = rest.pop();
  const cacheKey = rest.length > 0 ? rest[0] : null;

  try {
    if (cacheKey && jsminCache.hasOwnProperty(cacheKey)) {
      const cacheValue = await Promise.resolve(jsminCache[cacheKey]);
      callback(null, cacheValue.code);
    } else {
      const minified = esbuild.transform(code, {
        minify: true
      });
      if (cacheKey) {
        jsminCache[cacheKey] = minified;
      }
      callback(null, (await minified).code);
    }
  } catch (err) {
    console.error('jsmin error: ', err);
    callback(null, code);
  }
};

export {minifyCss, minifyJs};
