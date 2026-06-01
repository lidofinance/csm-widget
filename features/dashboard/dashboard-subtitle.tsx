import { Divider, Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts';
import { isModuleCM } from 'consts/module';
import { getCurveMetadata } from 'consts/operator-type-metadata';
import { useNodeOperator, useOperatorGroup } from 'modules/web3';
import { FC } from 'react';
import { Stack } from 'shared/components/stack/stack';
import { DescriptorId, formatGroupTitle } from 'shared/node-operator';
import styled from 'styled-components';
import { TextLocalLink } from 'shared/navigate';

import { ReactComponent as ArrowRight } from 'assets/icons/arrow-forward.svg';

export const DashboardSubtitle: FC = () => {
  if (isModuleCM) return <CmSubtitle />;

  return <>Dashboard</>;
};

const CmSubtitle: FC = () => {
  const {
    nodeOperator: { nodeOperatorId, curveId },
  } = useNodeOperator<true>();
  const { data: group } = useOperatorGroup(nodeOperatorId);

  return (
    <Stack center gap="ms" selfJustify="center">
      <Text size="xxs">
        <DescriptorId id={nodeOperatorId} flat />
      </Text>
      <DividerStyle />
      <Text size="xxs">{getCurveMetadata(curveId).name}</Text>
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
