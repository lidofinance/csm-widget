import { Erc20Tokens } from '../common/tyles.js';
import { CommonTransactionProps } from '../core-sdk/types.js';
type AccountProps = Pick<CommonTransactionProps, 'account'>;
export type AmountAndTokenProps = {
    amount: bigint;
    token: Erc20Tokens;
};
export type AllowanceProps = Pick<AmountAndTokenProps, 'token'> & AccountProps;
export type CheckAllowanceProps = AmountAndTokenProps & AccountProps;
export type ApproveProps = AmountAndTokenProps & CommonTransactionProps;
export type isMultisigProps = AccountProps;
export type SignPermitProps = AmountAndTokenProps & CommonTransactionProps & AccountProps & {
    dealine?: bigint;
};
export type SignPermitOrApproveProps = SignPermitProps & ApproveProps;
export {};
//# sourceMappingURL=types.d.ts.map