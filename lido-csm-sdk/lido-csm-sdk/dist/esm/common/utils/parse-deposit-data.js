const formatHex = (keys) => `0x${keys.join('')}`;
export const parseDepositData = (keys) => {
    const publicKeys = keys.map((key) => key.pubkey);
    const signatures = keys.map((key) => key.signature);
    return {
        keysCount: BigInt(keys.length),
        publicKeys: formatHex(publicKeys),
        signatures: formatHex(signatures),
    };
};
//# sourceMappingURL=parse-deposit-data.js.map