module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
  modulePathIgnorePatterns: ['./test'],
  moduleNameMapper: {
    // @lidofinance/lido-csm-sdk's main index.cjs bundles deposit-data-sdk which
    // pulls in @chainsafe/ssz (ESM-only). Redirect to the common sub-bundle,
    // which provides the runtime error exports unit tests need: SDKError,
    // ERROR_CODE, classifyError, decodeRevertData, formatDecodedRevert.
    // (ContractErrorName / DecodedRevert are types — no runtime presence.)
    // CAUTION: common.cjs does NOT export TransactionCallbackStage (that lives
    // in index.cjs only). Do not unit-test shared/hook-form/form-controller/
    // build-tx-callback.ts without mocking TransactionCallbackStage — under
    // this redirect it resolves to `undefined` and the ERROR-stage switch
    // silently falls through.
    '^@lidofinance/lido-csm-sdk$':
      '<rootDir>/node_modules/@lidofinance/lido-csm-sdk/dist/common.cjs',
    // @lidofinance/lido-ethereum-sdk pulls in ESM-only packages (multiformats,
    // blockstore-core, ipfs-unixfs-importer) via its stvault IPFS utils.
    // Unit tests never exercise IPFS/vault functionality — stub the SDK.
    '^@lidofinance/lido-ethereum-sdk$':
      '<rootDir>/__mocks__/@lidofinance/lido-ethereum-sdk.js',
    // env-dynamics.mjs is an ESM module not loadable by CJS Jest.
    // Stub it with a CJS-compatible zero-value equivalent.
    '^../env-dynamics\\.mjs$': '<rootDir>/__mocks__/env-dynamics.js',
    '^./env-dynamics\\.mjs$': '<rootDir>/__mocks__/env-dynamics.js',
    '^env-dynamics\\.mjs$': '<rootDir>/__mocks__/env-dynamics.js',
  },
};
