/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  clearMocks: true,
  moduleDirectories: ['node_modules'],
  transform: {
    '^.+\\.m?[tj]sx?$': ['ts-jest'],
  },
};
