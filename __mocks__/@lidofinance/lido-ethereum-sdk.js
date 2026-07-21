// Stub for @lidofinance/lido-ethereum-sdk in Jest unit tests.
// The real SDK imports ESM-only packages (multiformats, blockstore-core, etc.)
// that are not resolvable by CJS Jest. Only the CHAINS constant is referenced
// from lido-csm-sdk's module-config.cjs in unit test context.
const CHAINS = {
  Mainnet: 1,
  Hoodi: 560048,
};
module.exports = { CHAINS };
