import { TransactionResult } from '@lidofinance/lido-ethereum-sdk';
import { CsmSDKModule } from '../common/class-primitives/csm-sdk-module.js';
import { WithToken } from '../common/index.js';
import { SpendingSDK } from '../spending-sdk/spending-sdk.js';
import { AddNodeOperatorProps, AddNodeOperatorResult } from './types.js';
export declare class PermissionlessGateSDK extends CsmSDKModule<{
    spending: SpendingSDK;
}> {
    private get contract();
    addNodeOperatorETH(props: AddNodeOperatorProps): Promise<TransactionResult<AddNodeOperatorResult>>;
    addNodeOperatorStETH(props: AddNodeOperatorProps): Promise<TransactionResult<AddNodeOperatorResult>>;
    addNodeOperatorWstETH(props: AddNodeOperatorProps): Promise<TransactionResult<AddNodeOperatorResult>>;
    addNodeOperator(props: WithToken<AddNodeOperatorProps>): Promise<TransactionResult<AddNodeOperatorResult>>;
    private parseProps;
    private getPermit;
    private receiptParseEvents;
    getCurveId(): Promise<bigint>;
}
//# sourceMappingURL=permissionless-gate-sdk.d.ts.map