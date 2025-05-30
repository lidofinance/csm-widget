import { zeroAddress } from 'viem';
export const clearEmptyAddress = (address) => {
    return address !== zeroAddress ? address : undefined;
};
//# sourceMappingURL=clear-empty-address.js.map