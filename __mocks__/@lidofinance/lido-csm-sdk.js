// Redirect for @lidofinance/lido-csm-sdk in Jest unit tests. The package's
// main index.cjs bundles deposit-data-sdk, which pulls in @chainsafe/ssz
// (ESM-only). common.cjs is the safe sub-bundle with the runtime error
// exports (SDKError, ERROR_CODE, classifyError, decodeRevertData,
// formatDecodedRevert) but it does not carry MIN/MAX_EFFECTIVE_BALANCE
// (those live in keys-with-status-sdk/consts.cjs) — merge both in.
// CAUTION: common.cjs does NOT export TransactionCallbackStage (that lives
// in index.cjs only). Do not unit-test shared/hook-form/form-controller/
// build-tx-callback.ts without mocking TransactionCallbackStage — under
// this redirect it resolves to `undefined` and the ERROR-stage switch
// silently falls through.
module.exports = {
  ...require('../../node_modules/@lidofinance/lido-csm-sdk/dist/common.cjs'),
  ...require('../../node_modules/@lidofinance/lido-csm-sdk/dist/keys-with-status-sdk/consts.cjs'),
};
