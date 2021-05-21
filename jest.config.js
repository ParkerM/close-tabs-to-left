module.exports = {
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
  moduleFileExtensions: ['ts', 'js'],
  setupFilesAfterEnv: ['./src/setupTests.ts'],
  coverageReporters: [
    // defaults
    'json',
    'lcov',
    'text',
    'clover',
    // required for make-coverage-badge
    'json-summary',
  ],
};
