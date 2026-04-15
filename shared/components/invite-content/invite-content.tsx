import { NodeOperatorInvite } from '@lidofinance/lido-csm-sdk';
import { Tooltip } from '@lidofinance/lido-ui';
import { useOperatorInfo } from 'modules/web3';
import { FC } from 'react';
import { RoleActionsList } from 'shared/components/role-actions';
import { ROLES_METADATA } from 'consts';
import { DescriptorId } from 'shared/node-operator';
import { Badge, InviteContentStyle } from './style';

export const InviteContent: FC<{ invite: NodeOperatorInvite }> = ({
  invite,
}) => {
  const { data: info } = useOperatorInfo(invite.id);
  const extendedManagerPermissions = info?.extendedManagerPermissions ?? true;

  return (
    <InviteContentStyle>
      <DescriptorId id={invite.id} />
      <Tooltip
        placement="bottomLeft"
        title={
          <RoleActionsList
            role={invite.role}
            extendedManagerPermissions={extendedManagerPermissions}
          />
        }
      >
        <Badge>
          {ROLES_METADATA[invite.role].capitalizedTitle} address role
        </Badge>
      </Tooltip>
    </InviteContentStyle>
  );
};
