"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDepositData = void 0;
const formatHex = (keys) => `0x${keys.join('')}`;
const parseDepositData = (keys) => {
    const publicKeys = keys.map((key) => key.pubkey);
    const signatures = keys.map((key) => key.signature);
    return {
        keysCount: BigInt(keys.length),
        publicKeys: formatHex(publicKeys),
        signatures: formatHex(signatures),
    };
};
exports.parseDepositData = parseDepositData;
//# sourceMappingURL=parse-deposit-data.js.map