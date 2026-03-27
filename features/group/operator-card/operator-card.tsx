import {
  NodeOperatorInfo,
  OperatorMetadata,
  SubOperatorStakeSummary,
} from '@lidofinance/lido-csm-sdk';
import { Block, InlineLoader, Text } from '@lidofinance/lido-ui';
import { getCurveMetadata } from 'consts/operator-type-metadata';
import {
  useOperatorCurveId,
  useOperatorInfo,
  useOperatorMetadata,
} from 'modules/web3';
import { FC, useMemo } from 'react';
import { Address, SquaredChip, Stack } from 'shared/components';
import { computeStakeData, StakeAndKeysData } from 'utils';
import { DescriptorId } from 'shared/node-operator';
import { StakeStats, KeyLimit, MoreKeysChip } from '../shared';
import { DividerStyled } from '../styles';
import { OperatorCardActions } from './operator-card-actions';

export const OperatorCard: FC<SubOperatorStakeSummary> = ({
  nodeOperatorId,
  ...props
}) => {
  const { data: metadata } = useOperatorMetadata(nodeOperatorId);
  const { data: info } = useOperatorInfo(nodeOperatorId);
  const { data: curveId } = useOperatorCurveId(nodeOperatorId);

  const stakeAndKeys = useMemo(
    () => (info ? computeStakeData(props, info) : undefined),
    [info, props],
  );

  const moreKeys = !!stakeAndKeys?.potentialAdditionalKeys;

  return (
    <Block>
      <Stack direction="column" gap="md">
        <OperatorCardHeader
          {...{
            nodeOperatorId,
            ...props,
            stakeAndKeys,
            metadata,
            info,
            curveId,
          }}
        />
        <StakeStats data={stakeAndKeys} />
        <KeyLimit info={info} />
        <OperatorCardActions
          nodeOperatorId={nodeOperatorId}
          info={info}
          moreKeys={moreKeys}
        />
      </Stack>
    </Block>
  );
};

const OperatorCardHeader: FC<
  SubOperatorStakeSummary & {
    metadata?: OperatorMetadata;
    info?: NodeOperatorInfo;
    curveId: bigint | undefined;
    stakeAndKeys: StakeAndKeysData | undefined;
  }
> = ({ nodeOperatorId, weight, metadata, info, curveId, stakeAndKeys }) => (
  <Stack direction="column" gap="xs">
    <Stack center spaceBetween>
      <Stack center>
        <Text as="h4" size="sm" weight={700}>
          <DescriptorId id={nodeOperatorId} />
        </Text>
        <SquaredChip>Weight: {String(weight)}</SquaredChip>
      </Stack>

      {info && (
        <MoreKeysChip
          more={!!stakeAndKeys?.potentialAdditionalKeys}
          empty={!info?.totalAddedKeys}
        />
      )}
    </Stack>

    {metadata && info && curveId !== undefined ? (
      <Stack center gap="sm">
        <Text size="xs">{metadata.name}</Text>
        <DividerStyled />
        <Text size="xs">{getCurveMetadata(curveId).name}</Text>
      </Stack>
    ) : (
      <InlineLoader />
    )}

    {info ? (
      <Stack center gap="sm">
        <Text size="xxs" color="secondary">
          Rewards:{' '}
          <Address address={info.rewardsAddress} symbols={4} size="xxs" />
        </Text>
        <DividerStyled />
        <Text size="xxs" color="secondary">
          Manager:{' '}
          <Address address={info.managerAddress} symbols={4} size="xxs" />
        </Text>
      </Stack>
    ) : (
      <InlineLoader />
    )}
  </Stack>
);
