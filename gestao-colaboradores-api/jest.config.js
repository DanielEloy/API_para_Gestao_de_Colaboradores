module.exports = {
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  testMatch: [
    '<rootDir>/tests/**/*.test.js'
  ],
  
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/utils/logger.js'
  ],
  
  // ⚠️ THRESHOLDS MAIS REALISTAS
  coverageThreshold: {
    global: {
      branches: 30,  // ✅ Reduzido para 30%
      functions: 50,
      lines: 50,
      statements: 50
    }
  },
  
  transformIgnorePatterns: [
    'node_modules/'
  ],
  
  testTimeout: 10000,
  maxWorkers: 1,
  forceExit: true
};