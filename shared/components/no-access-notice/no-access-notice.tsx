import { AccessLevel, type MethodAccess } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { useNodeOperator } from 'modules/web3';
import { WarningBlock } from '../warning-block/warning-block';

type NoAccessNoticeProps = {
  access: MethodAccess;
};

const useAccessRoleLabel = (access: MethodAccess): string | null => {
  const { nodeOperator } = useNodeOperator();

  switch (access.level) {
    case AccessLevel.ANYONE:
      return null;
    case AccessLevel.MANAGER:
      return 'Manager';
    case AccessLevel.REWARDS:
      return 'Rewards';
    case AccessLevel.OWNER:
      return nodeOperator?.extendedManagerPermissions ? 'Manager' : 'Rewards';
    case AccessLevel.PROPOSED_MANAGER:
      return 'Proposed Manager';
    case AccessLevel.PROPOSED_REWARDS:
      return 'Proposed Rewards';
    case AccessLevel.CLAIMER:
      return 'Manager, Rewards, or Claimer';
    case AccessLevel.PROTOCOL_ROLE:
      return null;
  }
};

export const NoAccessNotice: FC<NoAccessNoticeProps> = ({ access }) => {
  const roleLabel = useAccessRoleLabel(access);

  if (access.level === AccessLevel.ANYONE) {
    return (
      <WarningBlock type="notice">
        Please connect your wallet to perform this action.
      </WarningBlock>
    );
  }

  if (access.level === AccessLevel.PROTOCOL_ROLE) {
    return (
      <WarningBlock type="notice">
        This action requires a protocol-level permission.
      </WarningBlock>
    );
  }

  return (
    <WarningBlock type="notice">
      This action can only be performed by the <b>{roleLabel}</b> Address of the
      Node Operator.
    </WarningBlock>
  );
};
