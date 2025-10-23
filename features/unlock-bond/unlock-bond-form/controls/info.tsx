import { FC } from 'react';
import { Latice, MatomoLink, Stack, TitledAmount } from 'shared/components';
import { useUnlockBondFormData } from '../context';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import {
  MEV_STEALING_LINK,
  LIDO_REWARDS_VAULT_LINK,
} from 'consts/external-links';

export const Info: FC = () => {
  const { lockedBond } = useUnlockBondFormData();
  return (
    <>
      <Latice variant="secondary">
        <Stack direction="column" gap="sm">
          <TitledAmount
            warning
            title="Locked bond"
            help="Bond may be locked in the case of an MEV stealing event reported by a dedicated committee. This measure ensures that Node Operators are held accountable for any misbehavior or rule violations"
            amount={lockedBond}
            token={TOKENS.eth}
          />
          {!!lockedBond && (
            <div>
              <MatomoLink href={MEV_STEALING_LINK}>
                EL reward stealing
              </MatomoLink>{' '}
              penalties have been applied to your Node Operator because one of
              your validators produced a block with the EL rewards sent to the
              wrong address (an address different from from{' '}
              <MatomoLink href={LIDO_REWARDS_VAULT_LINK}>
                the Lido Execution Layer Rewards Vault
              </MatomoLink>
              )
              <br />
              <b>Actions required:</b>
              <ul>
                <li>
                  Compensate the amount of the penalty, otherwise the
                  corresponding part of your bond will be burned and your
                  beneficial bond curve will be reset to the default one.{' '}
                </li>
                <li>
                  Check if the feeRecipient address of your validators consensus
                  / validator client is set to{' '}
                  <MatomoLink href={LIDO_REWARDS_VAULT_LINK}>
                    the Lido Execution Layer Rewards Vault
                  </MatomoLink>{' '}
                  to avoid the further penalties.
                </li>
              </ul>
            </div>
          )}
        </Stack>
      </Latice>
    </>
  );
};
