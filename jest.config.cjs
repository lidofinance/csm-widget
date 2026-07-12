module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svg.ts',
  },
  modulePathIgnorePatterns: ['./test'],
  // Only *.test/*.spec files are suites — helper modules may live in __tests__
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
};
