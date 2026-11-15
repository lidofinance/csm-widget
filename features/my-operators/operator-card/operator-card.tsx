import {
  Card,
  Divider,
  Grid,
  Skeleton,
  Stack,
  StatItem,
  Typography,
} from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { ModuleNodeOperator } from 'modules/web3/operator-provider/types';
import { FC, ReactNode, useMemo } from 'react';
import { INFO_TEST_ID } from 'shared/components/bond-stats-card/bond-stats-card';
import { FormatToken } from 'shared/formatters';
import { useDisplayOperatorType, useOperatorOverview } from 'shared/hooks';
import {
  OperatorTypeTag,
  OperatorAvatar,
  OperatorAddresses,
  useOperatorTitle,
} from 'shared/node-operator';
import {
  ActiveKeysValue,
  CardHeader,
  CardHeaderLine,
  IssuesTag,
  OperatorCardAction,
} from '../parts';

const STATS_COLUMNS = { base: 3, smDown: 1 };

type Props = {
  operator: ModuleNodeOperator;
};

export const OperatorCard: FC<Props> = ({ operator }) => {
  const { nodeOperatorId, module } = operator;
  const ref = useMemo(
    () => ({ nodeOperatorId, module }),
    [nodeOperatorId, module],
  );
  const {
    keys,
    bond,
    availableToClaim,
    info,
    curve,
    isKeysPending,
    isBondPending,
    isRewardsPending,
  } = useOperatorOverview(ref);
  const { title } = useOperatorTitle(ref);
  const type = useDisplayOperatorType(curve);
  const titleId = `operator-card-${module}-${nodeOperatorId}-title`;

  const counts = keys?.counts;
  const liveKeys = counts
    ? counts.depositable + counts.activationPending + counts.active
    : 0;

  const value = (pending: boolean, node: ReactNode): ReactNode =>
    pending ? <Skeleton variant="text" /> : node;

  return (
    <Card
      align="stretch"
      data-operator-id={nodeOperatorId.toString()}
      data-operator-module={module}
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
                <CardHeaderLine gap={12} wrap grow>
                  <Typography
                    id={titleId}
                    variant="bodyLarge"
                    weight="semibold"
                    as="p"
                    dataTestId={{ root: 'operatorName' }}
                  >
                    {title}
                  </Typography>
                  {type && (
                    <OperatorTypeTag
                      type={type}
                      full={false}
                      tooltip={false}
                      data-testid="operatorTypeTag"
                    />
                  )}
                </CardHeaderLine>
              </Stack>
              <CardHeaderLine>
                <IssuesTag
                  count={isKeysPending ? undefined : keys?.issuesCount}
                  dataTestId="operatorIssuesChip"
                />
              </CardHeaderLine>
            </CardHeader>
            <OperatorAddresses info={info} />
          </Stack>
          <Divider />
          <Grid
            columns={STATS_COLUMNS}
            gap={16}
            dataTestId={{ root: 'operatorStats' }}
          >
            <StatItem
              size="small"
              align="left"
              label="Active keys"
              info="Active keys out of all non-withdrawn keys of the Node Operator"
              value={value(
                isKeysPending,
                counts ? (
                  <ActiveKeysValue active={counts.active} total={liveKeys} />
                ) : (
                  '—'
                ),
              )}
              dataTestId={{ ...INFO_TEST_ID, root: 'operatorActiveKeys' }}
            />
            <StatItem
              size="small"
              align="left"
              label="Balance, stETH"
              info="Total bond currently held for the Node Operator"
              value={value(
                isBondPending,
                <FormatToken
                  amount={bond?.current}
                  trimTrailingZeros
                  fallback="—"
                />,
              )}
              dataTestId={{
                ...INFO_TEST_ID,
                root: 'operatorBondBalance',
                value: 'textContent',
              }}
            />
            <StatItem
              size="small"
              align="left"
              label="Available, stETH"
              info="The amount you can claim now, including rewards and excess bond"
              value={value(
                isBondPending || isRewardsPending,
                <FormatToken
                  amount={availableToClaim}
                  trimTrailingZeros
                  fallback="—"
                />,
              )}
              dataTestId={{ ...INFO_TEST_ID, root: 'operatorAvailableToClaim' }}
            />
          </Grid>
        </Stack>
        <OperatorCardAction
          operator={ref}
          matomoSwitch={MATOMO_CLICK_EVENTS_TYPES.myOperatorsSwitch}
        />
      </Stack>
    </Card>
  );
};
