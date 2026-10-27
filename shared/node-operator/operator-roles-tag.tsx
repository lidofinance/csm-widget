import { getNodeOperatorRoles, ROLES } from '@lidofinance/lido-csm-sdk';
import { Tag, Tooltip } from '@lidofinance/lido-app-ui';
import { ROLES_METADATA } from 'consts';
import { useDappStatus } from 'modules/web3';
import { FC } from 'react';

export type OperatorRolesTagProps = {
  operator: Parameters<typeof getNodeOperatorRoles>[0];
  full?: boolean;
  tooltip?: boolean;
};

const getFullText = (roles: ROLES[]) =>
  `${roles.map((role) => ROLES_METADATA[role].capitalizedTitle).join(' & ')} Address`;

export const OperatorRolesTag: FC<OperatorRolesTagProps> = ({
  operator,
  full = false,
  tooltip = false,
}) => {
  const { address } = useDappStatus();
  const roles = getNodeOperatorRoles(operator, address);

  if (roles.length === 0) return null;

  const fullText = getFullText(roles);
  const tag = (
    <Tag>
      {full
        ? fullText
        : roles.map((role) => ROLES_METADATA[role].short).join('')}
    </Tag>
  );

  return tooltip && !full ? <Tooltip content={fullText}>{tag}</Tooltip> : tag;
};
