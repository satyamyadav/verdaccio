/* eslint comma-dangle: 0 */

module.exports = {
  name: 'verdaccio-jest',
  verbose: true,
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    'node_modules',
    'fixtures'
  ],
  testEnvironment: 'jest-environment-jsdom-global',
  testRegex: '(/test/unit.*\\.spec|test/functional.*\\.func|/test/unit/webui/.*\\.spec)\\.js',
  setupFiles: [
    './test/unit/setup-webui.js'
  ],
  modulePathIgnorePatterns: [
    'setup-webui.js'
  ],
  testPathIgnorePatterns: [
    '__snapshots__'
  ],
  moduleNameMapper: {
    '\\.(scss)$': '<rootDir>/node_modules/identity-obj-proxy',
    'github-markdown-css': '<rootDir>/node_modules/identity-obj-proxy',
    '\\.(png)$': '<rootDir>/node_modules/identity-obj-proxy'
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!react-syntax-highlighter)'
  ]
};
