// jest.config.cjs
module.exports = {
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // ✅ Transpila ESM para Jest entender
  transform: {
    '^.+\\.js$': 'babel-jest',
  },

  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/utils/logger.js'],

  coverageThreshold: {
    global: {
      branches: 30,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },

  testTimeout: 10000,
  maxWorkers: 1,
  forceExit: true,
};
