import { BlockNumber, BlockTag } from 'viem';
export type NonPendingBlockTag = Exclude<BlockTag, 'pending'>;
export type EventRangeProps = {
    step?: number;
    fromBlock?: BlockNumber | NonPendingBlockTag;
    toBlock?: BlockNumber | NonPendingBlockTag;
};
//# sourceMappingURL=types.d.ts.map