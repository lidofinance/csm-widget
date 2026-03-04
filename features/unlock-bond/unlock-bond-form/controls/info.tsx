import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { Latice, Stack, StatusChip, TitledAmount } from 'shared/components';
import { useUnlockBondFormData } from '../context';

export const Info: FC = () => {
  const { lockedBond, isExpired } = useUnlockBondFormData();
  return (
    <>
      <Latice variant="secondary">
        <Stack direction="column" gap="sm">
          <TitledAmount
            warning={!isExpired}
            title="Locked bond"
            help="Bond may be locked in the case of an MEV stealing event reported by a dedicated committee. This measure ensures that Node Operators are held accountable for any misbehavior or rule violations"
            chip={
              isExpired &&
              !!lockedBond && <StatusChip variant="warning">Expired</StatusChip>
            }
            amount={lockedBond}
            token={TOKENS.eth}
          />
          {!lockedBond && <div>Nothing to unlock</div>}
          {!!lockedBond &&
            (isExpired ? (
              <div>
                The lock period has expired. You can unlock your bond without
                any compensation
              </div>
            ) : (
              <div>
                Penalties have been applied to your Node Operator. If they
                aren&apos;t covered, the corresponding amount of your bond may
                be burned. See details in the table below.
                <br />
                <b>Actions required:</b>
                <ul>
                  <li>
                    Compensate the penalty amount to prevent the related portion
                    of your bond from being burned.
                  </li>
                  <li>
                    Review the penalty details and fix the underlying issue to
                    avoid additional penalties.
                  </li>
                </ul>
              </div>
            ))}
        </Stack>
      </Latice>
    </>
  );
};
