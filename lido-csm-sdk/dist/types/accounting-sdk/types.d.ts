import { NodeOperatorId, PerToken } from '../common/tyles.js';
export type AmountByKeys = PerToken<bigint>;
export type KeysCountByBondAmountProps = {
    curveId: bigint;
    amount: bigint;
};
export type BondAmountByKeysCountProps = {
    curveId: bigint;
    keysCount: bigint;
};
export type BondForNextKeysProps = {
    nodeOperatorId: NodeOperatorId;
    keysCount: bigint;
};
//# sourceMappingURL=types.d.ts.map