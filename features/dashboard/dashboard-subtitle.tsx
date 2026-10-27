import { Divider, Edit, Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts';
import { MODULE_METADATA } from 'consts/module';
import {
  useModule,
  useNodeOperator,
  useOperatorGroup,
  useOperatorMetadata,
} from 'modules/web3';
import { FC } from 'react';
import { Stack } from 'shared/components/stack/stack';
import { useCurveMetadata, useShowFlags } from 'shared/hooks';
import { DescriptorId, formatGroupTitle } from 'shared/node-operator';
import styled from 'styled-components';
import { SecondaryLocalLink, TextLocalLink } from 'shared/navigate';

import { ReactComponent as ArrowRight } from 'assets/icons/arrow-forward.svg';

export const DashboardSubtitle: FC = () => {
  const { module, isCM } = useModule();

  if (isCM) return <CmSubtitle />;
  if (!module) return null;

  return <>{MODULE_METADATA[module].title}</>;
};

const OperatorName: FC = () => {
  const {
    nodeOperator: { nodeOperatorId, module },
  } = useNodeOperator<true>();
  const { data: metadata, isPending } = useOperatorMetadata({
    nodeOperatorId,
    module,
  });
  const { IS_NODE_OPERATOR } = useShowFlags();

  if (isPending) return <>{MODULE_METADATA[module].title}</>;

  return (
    <>
      <span data-testid="operatorName">{metadata?.name}</span>
      {IS_NODE_OPERATOR && !metadata?.ownerEditsRestricted && (
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

const CmSubtitle: FC = () => {
  const { nodeOperator } = useNodeOperator<true>();
  const { nodeOperatorId, module } = nodeOperator;
  const { data: group } = useOperatorGroup({ nodeOperatorId, module });
  const metadata = useCurveMetadata(nodeOperator);
  const { IS_NODE_OPERATOR } = useShowFlags();

  return (
    <Stack center gap="ms" wrap>
      <Text size="xxs">
        <OperatorName />
      </Text>
      <DividerStyle />
      <Text size="xxs">
        <DescriptorId id={nodeOperatorId} flat />
      </Text>
      <DividerStyle />
      <Text size="xxs">{metadata?.name}</Text>
      {group && IS_NODE_OPERATOR ? (
        <>
          <DividerStyle />
          <TextLocalLink
            href={PATH.GROUP}
            title="View group"
            data-testid="operatorGroupLink"
          >
            <Stack as="span" center gap="xs">
              {formatGroupTitle(group)}
              <ArrowRight />
            </Stack>
          </TextLocalLink>
        </>
      ) : null}
    </Stack>
  );
};

const DividerStyle = styled(Divider).attrs({ type: 'vertical' })`
  opacity: 0.3;
`;

const InlineWrapper = styled.span`
  display: inline-flex;
  margin-left: 4px;
  vertical-align: middle;
`;
