import { Divider, Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts';
import { useModule, useNodeOperator, useOperatorGroup } from 'modules/web3';
import { FC } from 'react';
import { Stack } from 'shared/components/stack/stack';
import { useCurveMetadata } from 'shared/hooks';
import { DescriptorId, formatGroupTitle } from 'shared/node-operator';
import styled from 'styled-components';
import { TextLocalLink } from 'shared/navigate';

import { ReactComponent as ArrowRight } from 'assets/icons/arrow-forward.svg';

export const DashboardSubtitle: FC = () => {
  const { isCM } = useModule();

  if (isCM) return <CmSubtitle />;

  return <>Dashboard</>;
};

const CmSubtitle: FC = () => {
  const { nodeOperator } = useNodeOperator<true>();
  const { nodeOperatorId } = nodeOperator;
  const { data: group } = useOperatorGroup(nodeOperatorId);
  const metadata = useCurveMetadata(nodeOperator);

  return (
    <Stack center gap="ms" selfJustify="center">
      <Text size="xxs">
        <DescriptorId id={nodeOperatorId} flat />
      </Text>
      <DividerStyle />
      <Text size="xxs">{metadata?.name}</Text>
      {group ? (
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
