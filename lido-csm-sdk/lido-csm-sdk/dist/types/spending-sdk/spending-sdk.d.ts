import {
  CheckAllowanceResult,
  TransactionResult,
} from '@lidofinance/lido-ethereum-sdk';
import { Address, erc20Abi, GetContractReturnType, WalletClient } from 'viem';
import { CsmSDKModule } from '../common/class-primitives/csm-sdk-module.js';
import { Erc20Tokens } from '../common/index.js';
import {
  AllowanceProps,
  ApproveProps,
  CheckAllowanceProps,
  isMultisigProps,
  SignPermitOrApproveProps,
  SignPermitProps,
} from './types.js';
export declare class SpendingSDK extends CsmSDKModule {
  protected get spender(): Address;
  getTokenContract(
    token: Erc20Tokens,
  ): GetContractReturnType<typeof erc20Abi, WalletClient>;
  signPermit(
    props: SignPermitProps,
  ): Promise<import('@lidofinance/lido-ethereum-sdk').PermitSignature>;
  allowance({ account: accountProp, token }: AllowanceProps): Promise<bigint>;
  checkAllowance(props: CheckAllowanceProps): Promise<CheckAllowanceResult>;
  approve(props: ApproveProps): Promise<TransactionResult>;
  isMultisig(props: isMultisigProps): Promise<boolean>;
  signPermitOrApprove(props: SignPermitOrApproveProps): Promise<
    | {
        permit: import('../common/tyles.js').PermitSignatureShort;
        hash?: undefined;
      }
    | {
        permit: import('../common/tyles.js').PermitSignatureShort;
        hash: `0x${string}`;
      }
  >;
  /**
   * Add 10 wei for approve/permit request
   * for stETH only
   */
  private parseProps;
}
//# sourceMappingURL=spending-sdk.d.ts.map
