/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  clearMocks: true,
  moduleDirectories: ['node_modules'],
  // transformIgnorePatterns: ['node_modules/(?!idna-uts46-hx)/'],
  transform: {
    '^.+\\.mjs$': 'ts-jest',
  },
};
