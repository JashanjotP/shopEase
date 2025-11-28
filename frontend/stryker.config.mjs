// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  _comment:
    "CI-friendly: faster by ignoring static mutants and using coverageAnalysis: 'all'",
  mutate: [
    "src/**/*.js",
    "!src/**/*.test.js",
    "!src/setupTests.js",
    "!src/reportWebVitals.js",
    "!src/index.js",
    "!src/__mocks__/**/*.js",
  ],
  testRunner: "jest",
  reporters: ["progress", "clear-text", "html"],
  coverageAnalysis: "perTest",      // much faster than perTest
  ignoreStatic: true,          // skip expensive static mutants (recommended)
  concurrency: 3,
  jest: {
    projectType: "create-react-app",
  },
  // optional quality gate:
  thresholds: { high: 80, low: 60, break: 50 },
  mutator:{
    excludedMutations: ["OptionalChaining", "StringLiteral"]
  }
};
export default config;
