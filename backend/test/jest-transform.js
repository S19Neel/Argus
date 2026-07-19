const tsJest = require('ts-jest').default.createTransformer();

module.exports = {
  process(src, filename, config, options) {
    if (src.includes('import.meta.url')) {
      src = src.replace(
        /import\.meta\.url/g,
        `('file://' + __filename.replace(/\\\\/g, '/'))`,
      );
    }
    return tsJest.process(src, filename, config, options);
  },
};
