import { Edit } from '@lidofinance/lido-ui';
import { PATH } from 'consts';
import { moduleMeta } from 'consts/module';
import { useModule, useNodeOperator, useOperatorMetadata } from 'modules/web3';
import { FC } from 'react';
import { SecondaryLocalLink } from 'shared/navigate';
import styled from 'styled-components';

const ModuleTitle: FC = () => <>{moduleMeta.title}</>;

export const DashboardTitle: FC = () => {
  const { isCM } = useModule();

  if (isCM) return <CmTitle />;

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
      <span data-testid="operatorName">{metadata?.name}</span>
      {!metadata?.ownerEditsRestricted && (
        <InlineWrapper>
          <SecondaryLocalLink
            href={PATH.SETTINGS_METADATA}
            title="Edit Operator Metadata"
            data-testid="editMetadataLink"
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
