/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  mode: 'development', // explicitly provide --mode=production for prod builds
  entry: {
    background: './src/background.ts',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
    clean: true,
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      'webextension-polyfill-ts': path.resolve(path.join(__dirname, 'node_modules', 'webextension-polyfill-ts')),
    },
  },
  module: {
    rules: [
      // All files with a ".ts" extension will be handled by "ts-loader".
      {test: /\.ts$/, loader: 'ts-loader'},

      // All output ".js" files will have any sourcemaps re-processed by "source-map-loader".
      {enforce: 'pre', test: /\.js$/, loader: 'source-map-loader'},
    ],
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {},
};
