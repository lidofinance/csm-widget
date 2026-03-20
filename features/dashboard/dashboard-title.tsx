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
        <StyledLocalLink
          href={PATH.SETTINGS_METADATA}
          title="Edit Operator Metadata"
        >
          <Edit />
        </StyledLocalLink>
      )}
    </Stack>
  );
};

export const StyledLocalLink = styled(LocalLink)`
  display: inline-flex;
  font-weight: normal;
  svg {
    color: var(--lido-color-textSecondary);
  }

  &,
  &:visited {
    color: var(--lido-color-text);
  }
  &:hover {
    color: var(--lido-color-primary);
    svg {
      color: currentColor;
    }
  }
`;
