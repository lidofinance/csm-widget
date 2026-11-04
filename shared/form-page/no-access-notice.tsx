import { MessageBox } from '@lidofinance/lido-app-ui';
import { AccessLevel, type MethodAccess } from '@lidofinance/lido-csm-sdk';
import { useNodeOperator } from 'modules/web3';
import { FC, ReactNode } from 'react';
import { getAccessRoleLabel } from './access-role-label';

export type NoAccessNoticeProps = {
  access: MethodAccess;
  children?: ReactNode;
  'data-testid'?: string;
};

const DefaultCopy: FC<{ access: MethodAccess }> = ({ access }) => {
  const { nodeOperator } = useNodeOperator();
  const roleLabel = getAccessRoleLabel(
    access.level,
    nodeOperator?.extendedManagerPermissions,
  );

  if (access.level === AccessLevel.ANYONE) {
    return <>Please connect your wallet to perform this action</>;
  }

  if (!roleLabel) {
    return <>This action requires a protocol-level permission</>;
  }

  return (
    <>
      This action can only be performed by the <b>{roleLabel}</b> Address of the
      Node Operator
    </>
  );
};

export const NoAccessNotice: FC<NoAccessNoticeProps> = ({
  access,
  children,
  'data-testid': testId = 'noAccessNotice',
}) => (
  <MessageBox dataTestId={{ root: testId }}>
    {children ?? <DefaultCopy access={access} />}
  </MessageBox>
);
