const globalIgnorePatterns = ['src', 'coverage', '*.json', '*.lock', '*.js', 'README.md', 'dist/*.map'];
const globalIncludePatterns = ['manifest.json'];
const createFileFilter = (ignore = [], include = []) =>
  globalIgnorePatterns.concat(ignore).concat(globalIncludePatterns.concat(include).map(s => `!${s}`));
const defaultFileFilter = createFileFilter();

const webExtConfig = {
  ignoreFiles: defaultFileFilter,
  build: {
    overwriteDest: true,
  },
};

module.exports = webExtConfig;
