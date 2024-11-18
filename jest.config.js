module.exports = {
  transform: {
    '^.+\\.js$': ['babel-jest', { configFile: './babel.config.js' }]
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js'
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  testTimeout: 10000,
  setupFilesAfterEnv: ['./jest.setup.js'],
  roots: ['<rootDir>/src']
};