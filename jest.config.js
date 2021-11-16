module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.[t|j]sx?$': 'babel-jest'
  },
  verbose: true
}
