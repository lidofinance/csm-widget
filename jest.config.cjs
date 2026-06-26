module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
  modulePathIgnorePatterns: ['./test'],
  // The full lido-csm-sdk index.cjs has transitive ESM-only deps (multiformats,
  // @chainsafe/ssz, ipfs-unixfs-importer, etc.) that Jest cannot load.
  // Use a lightweight shim that re-exports only the CJS sub-paths needed for
  // unit tests while providing the real enum values (not mocked).
  moduleNameMapper: {
    '^@lidofinance/lido-csm-sdk$': '<rootDir>/__mocks__/lido-csm-sdk.js',
  },
};
