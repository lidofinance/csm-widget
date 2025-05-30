import { TransactionResult } from '@lidofinance/lido-ethereum-sdk';
import { CsmSDKModule } from '../common/class-primitives/csm-sdk-module.js';
import { WithToken } from '../common/index.js';
import { SpendingSDK } from '../spending-sdk/spending-sdk.js';
import {
  AddKeysProps,
  EjectKeysProps,
  MigrateKeysProps,
  RemoveKeysProps,
} from './types.js';
export declare class KeysSDK extends CsmSDKModule<{
  spending: SpendingSDK;
}> {
  private get contract();
  private get ejectorContract();
  addKeysETH(props: AddKeysProps): Promise<TransactionResult>;
  addKeysStETH(props: AddKeysProps): Promise<TransactionResult>;
  addKeysWstETH(props: AddKeysProps): Promise<TransactionResult>;
  addKeys(props: WithToken<AddKeysProps>): Promise<TransactionResult>;
  private parseProps;
  private getPermit;
  removeKeys(props: RemoveKeysProps): Promise<TransactionResult>;
  ejectKeys(props: EjectKeysProps): Promise<TransactionResult>;
  migrateToPriorityQueue(props: MigrateKeysProps): Promise<TransactionResult>;
}
//# sourceMappingURL=keys-sdk.d.ts.map
