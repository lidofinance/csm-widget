import { CHAINS, LidoSDKCore, TransactionResult } from '@lidofinance/lido-ethereum-sdk';
import { Abi, Address, Chain, GetContractReturnType, WalletClient } from 'viem';
import { CSAccountingAbi, CSEjectorAbi, CSFeeDistributorAbi, CSFeeOracleAbi, CSModuleAbi, CSParametersRegistryAbi, CSStrikesAbi, CSVerifierAbi, HashConsensusAbi, PermissionlessGateAbi, StakingRouterAbi, ValidatorsExitBusOracleAbi, VettedGateAbi } from '../abi/index.js';
import { CsmSDKCacheable } from '../common/class-primitives/csm-sdk-cacheable.js';
import { CSM_CONTRACT_NAMES, Erc20Tokens } from '../common/index.js';
import { CSM_ADDRESSES, CsmCoreProps, PerformTransactionOptions } from './types.js';
export declare class CoreSDK extends CsmSDKCacheable {
    readonly core: LidoSDKCore;
    readonly overridedAddresses?: CSM_ADDRESSES;
    constructor(props: CsmCoreProps);
    get chainId(): CHAINS;
    get chain(): Chain;
    get logMode(): import("@lidofinance/lido-ethereum-sdk").LOG_MODE;
    getContractAddress(contract: CSM_CONTRACT_NAMES | Erc20Tokens): Address;
    getContract<T extends Abi>(contractName: CSM_CONTRACT_NAMES, abi: T): GetContractReturnType<T, WalletClient>;
    getContractCSAccounting(): GetContractReturnType<typeof CSAccountingAbi, WalletClient>;
    getContractCSEjector(): GetContractReturnType<typeof CSEjectorAbi, WalletClient>;
    getContractCSFeeDistributor(): GetContractReturnType<typeof CSFeeDistributorAbi, WalletClient>;
    getContractCSFeeOracle(): GetContractReturnType<typeof CSFeeOracleAbi, WalletClient>;
    getContractCSModule(): GetContractReturnType<typeof CSModuleAbi, WalletClient>;
    getContractCSParametersRegistry(): GetContractReturnType<typeof CSParametersRegistryAbi, WalletClient>;
    getContractCSStrikes(): GetContractReturnType<typeof CSStrikesAbi, WalletClient>;
    getContractCSVerifier(): GetContractReturnType<typeof CSVerifierAbi, WalletClient>;
    getContractHashConsensus(): GetContractReturnType<typeof HashConsensusAbi, WalletClient>;
    getContractPermissionlessGate(): GetContractReturnType<typeof PermissionlessGateAbi, WalletClient>;
    getContractVettedGate(): GetContractReturnType<typeof VettedGateAbi, WalletClient>;
    getContractStakingRouter(): GetContractReturnType<typeof StakingRouterAbi, WalletClient>;
    getContractValidatorsExitBusOracle(): GetContractReturnType<typeof ValidatorsExitBusOracleAbi, WalletClient>;
    performTransaction<TDecodedResult = undefined>(props: PerformTransactionOptions<TDecodedResult>): Promise<TransactionResult<TDecodedResult>>;
}
//# sourceMappingURL=core-sdk.d.ts.map