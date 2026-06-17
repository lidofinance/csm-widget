// Lightweight shim for @lidofinance/lido-csm-sdk in Jest unit tests.
// The full SDK index.cjs has transitive ESM-only deps (multiformats, @chainsafe/ssz, etc.)
// that Jest cannot load. This shim re-exports only the CJS sub-paths that have
// no ESM transitive dependencies, providing the real enum values.
const { MODULE_NAME, MODULE_CONTRACT } = require('../node_modules/@lidofinance/lido-csm-sdk/dist/common/constants/module-name.cjs');

module.exports = { MODULE_NAME, MODULE_CONTRACT };
