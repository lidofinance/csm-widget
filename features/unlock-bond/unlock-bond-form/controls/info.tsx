import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { BOND_EXCESS, BOND_INSUFFICIENT } from 'consts/text';
import { FC } from 'react';
import {
  Latice,
  Stack,
  StatusChip,
  TitledAmount,
  WarningBlock,
} from 'shared/components';
import { useUnlockBondFlow, useUnlockBondFormData } from '../context';
import { LocalLink } from 'shared/navigate';
import { PATH } from 'consts';

export const Info: FC = () => {
  const { bond, isExpired } = useUnlockBondFormData();
  const flow = useUnlockBondFlow();

  const showDelta =
    flow.action === 'compensate' || flow.action === 'insufficient-bond';

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
              !!bond?.locked && (
                <StatusChip variant="warning" squared>
                  Expired
                </StatusChip>
              )
            }
            amount={bond?.locked}
            token={TOKENS.steth}
          />
          {!!bond?.locked &&
            (isExpired ? (
              <div>
                The lock period has ended. You can unlock your bond now (no
                compensation required).
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
          {showDelta && (
            <TitledAmount
              warning={bond?.isInsufficient}
              title={bond?.isInsufficient ? BOND_INSUFFICIENT : BOND_EXCESS}
              amount={bond?.delta}
              token={TOKENS.steth}
            />
          )}
        </Stack>
      </Latice>
      {flow.action === 'insufficient-bond' && (
        <WarningBlock type="notice">
          Your bond is insufficient to compensate the locked amount. Please{' '}
          <LocalLink href={PATH.BOND_ADD}>top up the bond</LocalLink> first.
        </WarningBlock>
      )}
    </>
  );
};
