import {
  Divider,
  Skeleton,
  Stack,
  Tag,
  Typography,
} from '@lidofinance/lido-app-ui';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { OperatorRef, useOperatorCurveId } from 'modules/web3';
import { FC, useMemo } from 'react';
import { StretchCard } from 'shared/components';
import {
  KeyLimitNote,
  KeysNeededTag,
  StakeAllocationBar,
  StakeAllocationStats,
} from 'shared/components/stake-allocation';
import { useCurveMetadata } from 'shared/hooks';
import {
  getOperatorName,
  OperatorAvatar,
  OperatorAddresses,
  useOperatorTitle,
} from 'shared/node-operator';
import styled from 'styled-components';
import { formatBP, formatPercent } from 'utils';
import { CardHeader, OperatorCardAction } from '../parts';
import type { GroupMemberStake } from './use-group-stake';

const NameRowStyle = styled(Stack)`
  && {
    min-width: 0;
  }

  && > :first-child {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  && > :not(:first-child) {
    flex-shrink: 0;
  }
`;

type Props = {
  member: GroupMemberStake;
  isCurrent: boolean;
};

export const GroupMemberCard: FC<Props> = ({ member, isCurrent }) => {
  const { summary, info, stake, isInfoError } = member;
  const { nodeOperatorId, weight, share } = summary;

  const ref: OperatorRef = useMemo(
    () => ({ nodeOperatorId, module: MODULE_NAME.CM }),
    [nodeOperatorId],
  );
  const { title, name } = useOperatorTitle(ref);
  const { data: curveId, isPending: isCurvePending } = useOperatorCurveId(ref);
  const curve = useCurveMetadata(curveId);
  const idLine = getOperatorName(ref);
  const titleId = `group-member-${nodeOperatorId}-title`;
  const weightZero = weight === 0n;

  return (
    <StretchCard
      data-operator-id={nodeOperatorId.toString()}
      data-operator-module={MODULE_NAME.CM}
      aria-labelledby={titleId}
      dataTestId={{ root: 'operatorCard' }}
    >
      <Stack direction="column" gap={24} justify="between" grow>
        <Stack direction="column" gap={24}>
          <Stack direction="column" gap={8}>
            <CardHeader
              direction={{ base: 'row', smDown: 'column' }}
              gap={12}
              align="start"
              justify="between"
            >
              <Stack direction="row" gap={12} align="start" grow>
                <OperatorAvatar operator={ref} size={36} />
                <Stack direction="column" grow>
                  <NameRowStyle direction="row" gap={8} align="center">
                    <Typography
                      id={titleId}
                      title={title}
                      variant="bodyLarge"
                      weight="semibold"
                      as="p"
                      dataTestId={{ root: 'operatorMetadataName' }}
                    >
                      {title}
                    </Typography>
                    {isCurrent && (
                      <Tag
                        variant="neutral"
                        dataTestId={{ root: 'currentTag' }}
                      >
                        Current
                      </Tag>
                    )}
                  </NameRowStyle>
                  <Stack direction="row" gap={{ base: 24, smDown: 16 }}>
                    <Typography
                      variant="body"
                      color="secondary"
                      dataTestId={{ root: 'operatorWeight' }}
                    >
                      Weight: {formatBP(weight)}
                    </Typography>
                    <Typography
                      variant="body"
                      color="secondary"
                      dataTestId={{ root: 'operatorShare' }}
                    >
                      Share: {formatPercent(share / 10_000)}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
              {!isInfoError && (
                <KeysNeededTag
                  potentialAdditionalKeys={stake?.potentialAdditionalKeys}
                  empty={!info?.totalAddedKeys}
                  weightZero={weightZero}
                  pending={!info}
                />
              )}
            </CardHeader>
            <Stack direction="column" gap={4}>
              <Stack direction="row" gap={20} wrap>
                {title !== name && (
                  <Typography
                    variant="description"
                    color="tertiary"
                    dataTestId={{ root: 'descriptorId' }}
                  >
                    {idLine}
                  </Typography>
                )}
                {curve ? (
                  <Typography
                    variant="description"
                    color="tertiary"
                    dataTestId={{ root: 'operatorCurveName' }}
                  >
                    {curve.name}
                  </Typography>
                ) : (
                  isCurvePending && <Skeleton variant="text" />
                )}
              </Stack>
              {!isInfoError && <OperatorAddresses info={info} />}
            </Stack>
          </Stack>
          <Divider />
          <Stack direction="column" gap={16}>
            <StakeAllocationStats
              size="member"
              data={stake}
              error={isInfoError}
            />
            {!isInfoError && (
              <Stack direction="column" gap={8}>
                {stake && (
                  <StakeAllocationBar data={stake} weightZero={weightZero} />
                )}
                <KeyLimitNote info={info} />
              </Stack>
            )}
          </Stack>
        </Stack>
        <OperatorCardAction
          operator={ref}
          matomoSwitch={MATOMO_CLICK_EVENTS_TYPES.groupSwitchOperator}
        />
      </Stack>
    </StretchCard>
  );
};
