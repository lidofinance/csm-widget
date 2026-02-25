import { Edit } from '@lidofinance/lido-ui';
import { config } from 'config';
import { PATH } from 'consts';
import { isModuleCM, MODULE_METADATA } from 'consts/module';
import { useNodeOperator, useOperatorMetadata } from 'modules/web3';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { LocalLink } from 'shared/navigate';
import styled from 'styled-components';

const ModuleTitle: FC = () => <>{MODULE_METADATA[config.module].title}</>;

export const DashboardTitle: FC = () => {
  if (isModuleCM) return <CmTitle />;

  return <ModuleTitle />;
};

const CmTitle: FC = () => {
  const {
    nodeOperator: { nodeOperatorId },
  } = useNodeOperator<true>();
  const { data: metadata, isPending } = useOperatorMetadata(nodeOperatorId);

  if (isPending) return <ModuleTitle />;

  return (
    <Stack center gap="sm" selfJustify="center">
      <span>{metadata?.name}</span>
      {!metadata?.ownerEditsRestricted && (
        <StyledLink href={PATH.SETTINGS_METADATA}>
          <Edit />
        </StyledLink>
      )}
    </Stack>
  );
};

const StyledLink = styled(LocalLink)`
  display: inline-flex;

  &,
  &:visited {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
