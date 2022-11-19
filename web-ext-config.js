const globalIgnorePatterns = ['src', 'coverage', '*.json', '*.lock', '*.js', 'CHANGELOG.md', 'README.md', 'dist/*.map'];
const globalIncludePatterns = ['manifest.json'];
const createFileFilter = (ignore = [], include = []) =>
  globalIgnorePatterns.concat(ignore).concat(globalIncludePatterns.concat(include).map(s => `!${s}`));
const defaultFileFilter = createFileFilter();

const webExtConfig = {
  ignoreFiles: defaultFileFilter,
  build: {
    overwriteDest: true,
  },
  run: {
    firefox: 'firefoxdeveloperedition',
  },
};

module.exports = webExtConfig;
