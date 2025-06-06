import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
export declare enum LINK_TYPE {
    rewardsTree = "rewardsTree",
    keysApi = "keysApi"
}
export declare const EXTERNAL_LINKS: {
    [key in CHAINS]?: {
        [key2 in LINK_TYPE]?: string;
    };
};
//# sourceMappingURL=links.d.ts.map