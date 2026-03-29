import { Edit } from '@lidofinance/lido-ui';
import { config } from 'config';
import { PATH } from 'consts';
import { isModuleCM, MODULE_METADATA } from 'consts/module';
import { useNodeOperator, useOperatorMetadata } from 'modules/web3';
import { FC } from 'react';
import { SecondaryLocalLink } from 'shared/navigate';
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
    <>
      <span>{metadata?.name}</span>
      {!metadata?.ownerEditsRestricted && (
        <InlineWrapper>
          <SecondaryLocalLink
            href={PATH.SETTINGS_METADATA}
            title="Edit Operator Metadata"
          >
            <Edit />
          </SecondaryLocalLink>
        </InlineWrapper>
      )}
    </>
  );
};

const InlineWrapper = styled.span`
  display: inline-flex;
  margin-left: 4px;
  vertical-align: middle;
`;
