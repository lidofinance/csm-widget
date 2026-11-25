import { MessageBox } from '@lidofinance/lido-app-ui';
import { MODULE_METADATA } from 'consts/module';
import { OperatorRef } from 'modules/web3';
import { FC } from 'react';

export const CustomAddressesNotice: FC<{ operator: OperatorRef }> = ({
  operator,
}) => (
  <MessageBox
    variant="warning"
    headline="You have created a Node Operator with custom addresses"
    data-testid="customAddressesNotice"
  >
    To continue, connect to {MODULE_METADATA[operator.module].shortTitle} UI
    with the address you specified as Reward/Manager Address for Node Operator #
    {operator.nodeOperatorId.toString()} or create a new Node Operator using the
    currently connected address
  </MessageBox>
);
