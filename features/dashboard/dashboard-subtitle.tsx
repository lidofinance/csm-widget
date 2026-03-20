import { Divider, Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts';
import { isModuleCM } from 'consts/module';
import { getCurveMetadata } from 'consts/operator-type-metadata';
import { useNodeOperator, useOperatorGroupId } from 'modules/web3';
import { FC } from 'react';
import { Stack } from 'shared/components/stack/stack';
import { DescriptorId } from 'shared/node-operator';
import styled from 'styled-components';
import { StyledLocalLink } from './dashboard-title';

import { ReactComponent as ArrowRight } from 'assets/icons/arrow-forward.svg';

export const DashboardSubtitle: FC = () => {
  if (isModuleCM) return <CmSubtitle />;

  return <>Dashboard</>;
};

const CmSubtitle: FC = () => {
  const {
    nodeOperator: { nodeOperatorId, curveId },
  } = useNodeOperator<true>();
  const { data: groupId } = useOperatorGroupId(nodeOperatorId);

  return (
    <Stack center gap="ms" selfJustify="center">
      <Text size="xxs">
        <DescriptorId id={nodeOperatorId} flat />
      </Text>
      <DividerStyle />
      <Text size="xxs">{getCurveMetadata(curveId).name}</Text>
      {groupId ? (
        <>
          <DividerStyle />
          <Stack gap="sm" center>
            <StyledLocalLink href={PATH.GROUP} title="View group">
              <Stack as="span" center gap="xs">
                Operator Group #{`${groupId}`}
                <ArrowRight />
              </Stack>
            </StyledLocalLink>
          </Stack>
        </>
      ) : null}
    </Stack>
  );
};

const DividerStyle = styled(Divider).attrs({ type: 'vertical' })`
  opacity: 0.3;
`;
