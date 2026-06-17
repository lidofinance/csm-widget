// Stub for ESM-only packages that are not needed in unit tests.
// lido-ethereum-sdk pulls in multiformats and blockstore-core (ESM-only)
// via its stvault/ipfs utilities, which are unrelated to the code under test.
module.exports = {};
