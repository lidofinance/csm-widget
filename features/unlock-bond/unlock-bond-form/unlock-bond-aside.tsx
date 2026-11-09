import { DataListRow, Tag } from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { BOND_LOCKED } from 'consts/text';
import { FC } from 'react';
import { SubmitAside, SubmitButton } from 'shared/form-page';
import { FormatToken } from 'shared/formatters';
import { useUnlockBondFlow, useUnlockBondFormData } from './context';
import { getRemainingLockedBond } from './unlock-bond-state';

const CompensationRows: FC = () => {
  const { bond, compensationAmount } = useUnlockBondFormData(true);

  return (
    <>
      <DataListRow
        label="Compensating amount"
        info="Penalty compensation is deducted from the node operator's bond and cannot exceed the excess bond"
        description="Will be deducted from your bond balance"
        value={<FormatToken amount={compensationAmount} token={TOKENS.steth} />}
      />
      <DataListRow
        label="Remaining locked bond"
        value={
          <FormatToken
            amount={getRemainingLockedBond(bond.locked, compensationAmount)}
            token={TOKENS.steth}
          />
        }
      />
    </>
  );
};

const ExpiredRow: FC = () => {
  const { bond } = useUnlockBondFormData(true);

  return (
    <DataListRow
      label={
        <>
          {BOND_LOCKED} <Tag variant="warning">Expired</Tag>
        </>
      }
      value={<FormatToken amount={bond.locked} token={TOKENS.steth} />}
      dataTestId={{ root: 'lockedBondAmount' }}
    />
  );
};

export const UnlockBondAside: FC = () => {
  const flow = useUnlockBondFlow();
  const isUnlockExpired = flow.action === 'unlock-expired';

  return (
    <SubmitAside rows={isUnlockExpired ? <ExpiredRow /> : <CompensationRows />}>
      <SubmitButton>
        {isUnlockExpired ? 'Unlock bond' : 'Compensate locked bond'}
      </SubmitButton>
    </SubmitAside>
  );
};
