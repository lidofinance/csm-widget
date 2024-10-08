import { Checkbox } from '@lidofinance/lido-ui';
import { BOND_EXCESS, BOND_SHORTAGE } from 'consts/text';
import { TOKENS } from 'consts/tokens';
import { FC, useEffect } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import {
  AmountWithPrice,
  FormTitle,
  Latice,
  Stack,
  TitledSelectableAmount,
} from 'shared/components';
import { ClaimBondFormInputType, useClaimBondFormData } from '../context';

export const SourceSelect: FC = () => {
  const { bond, rewards, loading, maxValues } = useClaimBondFormData();

  const { field } = useController<ClaimBondFormInputType, 'claimRewards'>({
    name: 'claimRewards',
    disabled: bond?.isShortage,
  });

  const { setValue } = useFormContext<ClaimBondFormInputType>();

  const availableToClaim = maxValues?.[TOKENS.STETH][Number(field.value)];

  useEffect(() => {
    if (bond?.isShortage) {
      setValue('claimRewards', true);
    }
  }, [bond?.isShortage, setValue]);

  const showLockedBond = bond?.locked.gt(0);

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
              label={bond?.isShortage ? BOND_SHORTAGE : BOND_EXCESS}
            />
          }
          help={
            bond?.isShortage
              ? 'Shortage bond is the missing amount of stETH required to cover all operator’s keys. To avoid exit requests for unbonded validators, this amount must be compensated on the “Add bond” tab.'
              : 'The bond amount available to claim without having to exit validators'
          }
          sign={bond?.isShortage ? 'minus' : 'plus'}
          loading={loading.isBondLoading}
          amount={bond?.delta}
          token={TOKENS.STETH}
        />
        {showLockedBond && (
          <TitledSelectableAmount
            warning
            title={<Checkbox checked disabled label="Locked bond" />}
            help="Bond may be locked in the case of an MEV stealing event reported by a dedicated committee. This measure ensures that Node Operators are held accountable for any misbehavior or rule violations."
            loading={loading.isBondLoading}
            amount={bond?.locked}
            token={TOKENS.ETH}
            sign="minus"
          />
        )}
      </Latice>
    </>
  );
};
