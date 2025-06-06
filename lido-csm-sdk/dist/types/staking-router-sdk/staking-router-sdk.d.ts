import { CsmSDKModule } from '../common/class-primitives/csm-sdk-module.js';
import { ShareLimitInfo, ShareLimitStatus } from './types.js';
export declare class StakingRouterSDK extends CsmSDKModule {
    private get contract();
    private getAllModulesDigests;
    private calculateShareLimit;
    getShareLimit(): Promise<ShareLimitInfo>;
    getShareLimitStatus(shareLimitThreshold?: bigint): Promise<ShareLimitStatus>;
}
//# sourceMappingURL=staking-router-sdk.d.ts.map