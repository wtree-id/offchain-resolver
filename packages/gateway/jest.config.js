/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  clearMocks: true,
  moduleDirectories: ['node_modules'],
  transform: {
    '^.+\\.m?[tj]sx?$': ['ts-jest'],
  },
};
