import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { Address } from 'viem';
import { Erc20Tokens } from '../tyles.js';
export declare const CSM_SUPPORTED_CHAINS: CHAINS[];
export type CSM_SUPPORTED_CHAINS = CHAINS.Mainnet | CHAINS.Hoodi;
export declare enum CSM_CONTRACT_NAMES {
    csAccounting = "csAccounting",
    csEjector = "csEjector",
    csFeeDistributor = "csFeeDistributor",
    csFeeOracle = "csFeeOracle",
    csModule = "csModule",
    csParametersRegistry = "csParametersRegistry",
    csStrikes = "csStrikes",
    csVerifier = "csVerifier",
    hashConsensus = "hashConsensus",
    permissionlessGate = "permissionlessGate",
    vettedGate = "vettedGate",
    stakingRouter = "stakingRouter",
    validatorsExitBusOracle = "validatorsExitBusOracle",
    withdrawalVault = "withdrawalVault",
    stETH = "stETH",
    wstETH = "wstETH"
}
export declare const CSM_CONTRACT_ADDRESSES: {
    [key in CHAINS]?: {
        [key2 in CSM_CONTRACT_NAMES | Erc20Tokens]?: Address;
    };
};
export declare const MODULE_ID_BY_CHAIN: {
    [key in CHAINS]?: number;
};
export declare const DEPLOYMENT_BLOCK_NUMBER_BY_CHAIN: {
    [key in CHAINS]?: bigint;
};
export declare const SUPPORTED_VERSION_BY_CONTRACT: {
    readonly csAccounting: 2n;
    readonly csFeeDistributor: 2n;
    readonly csModule: 2n;
};
export declare const PERCENT_BASIS = 10000n;
//# sourceMappingURL=base.d.ts.map