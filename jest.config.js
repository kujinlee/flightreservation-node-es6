export default {
  testEnvironment: 'node',
  setupFiles: ['./tests/setupTests.js'], // Add setup file
  coverageDirectory: './coverage',
  collectCoverageFrom: ['src/**/*.js', '!src/config/**', '!src/views/**'], // Single-line array
  transform: {
    '^.+\\.js$': 'babel-jest', // Use babel-jest for ES module transformation
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(sequelize-test-helpers|chai)/)', // Transform specific ES module dependencies
  ],
};
