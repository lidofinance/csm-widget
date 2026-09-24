module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
  modulePathIgnorePatterns: ['./test'],
  moduleNameMapper: {
    // @lidofinance/lido-csm-sdk's main index.cjs bundles deposit-data-sdk which
    // pulls in @chainsafe/ssz (ESM-only). Redirect to a shim merging the
    // common sub-bundle (runtime error exports: SDKError, ERROR_CODE,
    // classifyError, decodeRevertData, formatDecodedRevert) with
    // MIN/MAX_EFFECTIVE_BALANCE from keys-with-status-sdk — see
    // __mocks__/@lidofinance/lido-csm-sdk.js for details.
    // (ContractErrorName / DecodedRevert are types — no runtime presence.)
    // CAUTION: this shim does NOT export TransactionCallbackStage (that lives
    // in index.cjs only). Do not unit-test shared/hook-form/form-controller/
    // build-tx-callback.ts without mocking TransactionCallbackStage — under
    // this redirect it resolves to `undefined` and the ERROR-stage switch
    // silently falls through.
    '^@lidofinance/lido-csm-sdk$':
      '<rootDir>/__mocks__/@lidofinance/lido-csm-sdk.js',
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
