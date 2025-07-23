import { Checkbox } from '@lidofinance/lido-ui';
import { BOND_EXCESS, BOND_INSUFFICIENT } from 'consts/text';
import { FC, useEffect } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import {
  AmountWithPrice,
  FormTitle,
  Latice,
  Stack,
  TitledSelectableAmount,
} from 'shared/components';
import { formatDate } from 'utils';
import { ClaimBondFormInputType, useClaimBondFormData } from '../context';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { useFrameInfo } from 'modules/web3';

export const SourceSelect: FC = () => {
  const { bond, rewards, loading, maxValues } = useClaimBondFormData();
  const { data: nextDistribution } = useFrameInfo(
    (data) => data.lastReport + data.frameDuration,
  );

  const { field } = useController<ClaimBondFormInputType, 'claimRewards'>({
    name: 'claimRewards',
    disabled: bond?.isInsufficient,
  });

  const { setValue } = useFormContext<ClaimBondFormInputType>();

  const availableToClaim = maxValues?.[TOKENS.steth][Number(field.value)];
  const nextRewardsDate = formatDate(nextDistribution);

  useEffect(() => {
    if (bond?.isInsufficient) {
      setValue('claimRewards', true);
    }
  }, [bond?.isInsufficient, setValue]);

  const showLockedBond = !!bond?.locked;

  return (
    <>
      <Stack spaceBetween data-testid="availableToClaimBalance">
        <FormTitle>Available to claim</FormTitle>
        <AmountWithPrice
          big
          amount={availableToClaim}
          token={TOKENS.steth}
          loading={loading.isBondLoading || loading.isRewardsLoading}
        />
      </Stack>
      <Latice data-testid="sourceSelect">
        <TitledSelectableAmount
          title={
            <Checkbox
              label="Rewards"
              {...field}
              value=""
              checked={!!field.value}
              disabled={!rewards?.available}
            />
          }
          help={`The rewards amount available to claim, obtained from all active validators of the Node Operator. Next rewards distribution is expected on ${nextRewardsDate}`}
          helpIcon="calendar"
          loading={loading.isRewardsLoading}
          amount={rewards?.available}
          token={TOKENS.steth}
          data-testid="rewardsSource"
        />
        <TitledSelectableAmount
          warning={bond?.isInsufficient}
          title={
            <Checkbox
              checked
              disabled
              label={bond?.isInsufficient ? BOND_INSUFFICIENT : BOND_EXCESS}
            />
          }
          help={
            bond?.isInsufficient
              ? 'Insufficient bond is the missing amount of stETH required to cover all operator’s keys'
              : 'The bond amount available to claim without having to exit validators. Increases daily'
          }
          helpIcon={bond?.isInsufficient ? undefined : 'calendar'}
          sign={bond?.isInsufficient ? 'minus' : 'plus'}
          loading={loading.isBondLoading}
          amount={bond?.delta}
          token={TOKENS.steth}
          data-testid="excessBondSource"
        />
        {showLockedBond && (
          <TitledSelectableAmount
            warning
            title={<Checkbox checked disabled label="Locked bond" />}
            help="Bond may be locked in the case of an MEV stealing event reported by a dedicated committee. This measure ensures that Node Operators are held accountable for any misbehavior or rule violations"
            loading={loading.isBondLoading}
            amount={bond?.locked}
            token={TOKENS.eth}
            sign="minus"
          />
        )}
      </Latice>
    </>
  );
};
