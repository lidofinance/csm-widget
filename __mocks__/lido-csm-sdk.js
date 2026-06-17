// Lightweight shim for @lidofinance/lido-csm-sdk in Jest unit tests.
// The full SDK index.cjs (and the dist/common.cjs barrel) transitively import
// ESM-only deps (multiformats, @chainsafe/ssz, ipfs-unixfs-importer) that Jest
// cannot load. This shim re-exports only specific LEAF CJS sub-paths that have
// no ESM transitive dependencies, providing the real enum values.
//
// FOR FUTURE TESTS: this mapper redirects the ENTIRE '@lidofinance/lido-csm-sdk'
// import for all Jest tests, so any runtime symbol not re-exported here resolves
// to `undefined` silently. To use another SDK symbol in a test, add its specific
// leaf CJS sub-path below. Do NOT `require` the barrel (dist/common.cjs) — it
// pulls in the ESM-only deps above and breaks the whole test run.
const { MODULE_NAME, MODULE_CONTRACT } = require('../node_modules/@lidofinance/lido-csm-sdk/dist/common/constants/module-name.cjs');

module.exports = { MODULE_NAME, MODULE_CONTRACT };
