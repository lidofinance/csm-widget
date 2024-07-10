import { Checkbox } from '@lidofinance/lido-ui';
import { TOKENS } from 'consts/tokens';
import { FC } from 'react';
import { useController } from 'react-hook-form';
import {
  AmountWithPrice,
  FormTitle,
  Latice,
  Stack,
  TitledSelectableAmount,
} from 'shared/components';
import { ClaimBondFormInputType } from '../context';
import { useClaimBondFormNetworkData } from '../context/use-claim-bond-form-network-data';
import { useMaxClaimValue } from '../hooks/use-max-claim-value';

export const SourceSelect: FC = () => {
  const { field } = useController<ClaimBondFormInputType>({
    name: 'claimRewards',
  });

  const { bond, rewards, lockedBond, loading } = useClaimBondFormNetworkData();
  const availableToClaim = useMaxClaimValue();

  // TODO: loading
  return (
    <>
      <Stack spaceBetween>
        <FormTitle>Available to claim</FormTitle>
        <AmountWithPrice
          big
          amount={availableToClaim}
          token={TOKENS.STETH}
          loading={loading.isBondLoading || loading.isRewardsLoading}
        />
      </Stack>
      <Latice>
        <TitledSelectableAmount
          title={
            <Checkbox
              label="Rewards"
              {...field}
              value=""
              checked={!!field.value}
            />
          }
          help="The rewards amount available to claim, obtained from all active validators of the Node Operator"
          loading={loading.isRewardsLoading}
          amount={rewards?.available}
          token={TOKENS.STETH}
        />
        <TitledSelectableAmount
          warning={bond?.isNoticiableShortage}
          title={
            <Checkbox
              checked
              disabled
              label={bond?.isShortage ? 'Shortage bond' : 'Excess bond'}
            />
          }
          help={
            bond?.isShortage
              ? '' // FIXME: text
              : 'The bond amount available to claim without having to exit validators'
          }
          sign={bond?.isShortage ? 'minus' : 'plus'}
          loading={loading.isBondLoading}
          amount={bond?.delta}
          token={TOKENS.STETH}
        />
        <TitledSelectableAmount
          warning
          title={<Checkbox checked disabled label="Locked bond" />}
          help="Bond may be locked in the case of an MEV stealing event reported by a dedicated committee. This measure ensures that Node Operators are held accountable for any misbehavior or rule violations."
          loading={loading.isLockedBondLoading}
          amount={lockedBond}
          token={TOKENS.ETH}
          sign="minus"
        />
      </Latice>
    </>
  );
};
