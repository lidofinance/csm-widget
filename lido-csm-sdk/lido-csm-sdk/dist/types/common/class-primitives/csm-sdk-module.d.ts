import { CoreSDK } from '../../core-sdk/core-sdk.js';
import { BusRegistry } from './bus-registry.js';
import { CsmSDKCacheable } from './csm-sdk-cacheable.js';
export type CsmSDKProps = {
  core: CoreSDK;
  bus?: BusRegistry;
};
export declare abstract class CsmSDKModule<
  TBus extends object = object,
> extends CsmSDKCacheable {
  readonly core: CoreSDK;
  readonly bus: BusRegistry<TBus>;
  constructor(props: CsmSDKProps, name?: string);
}
//# sourceMappingURL=csm-sdk-module.d.ts.map
