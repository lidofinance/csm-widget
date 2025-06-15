import { FC } from 'react';
import { Latice, MatomoLink, Stack, TitledAmount } from 'shared/components';
import { useUnlockBondFormData } from '../context';
import { TOKENS } from '@lidofinance/lido-csm-sdk';

export const Info: FC = () => {
  const { lockedBond, loading } = useUnlockBondFormData();
  return (
    <>
      <Latice variant="secondary">
        <Stack direction="column" gap="sm">
          <TitledAmount
            warning
            title="Locked bond"
            help="Bond may be locked in the case of an MEV stealing event reported by a dedicated committee. This measure ensures that Node Operators are held accountable for any misbehavior or rule violations"
            loading={loading.isLockedBondLoading}
            amount={lockedBond}
            token={TOKENS.eth}
          />
          {!!lockedBond && (
            <div>
              <MatomoLink href="https://docs.lido.fi/staking-modules/csm/guides/mev-stealing">
                EL reward stealing
              </MatomoLink>{' '}
              penalties have been applied to your Node Operator because one of
              your validators produced a block with the EL rewards sent to the
              wrong address (an address different from from{' '}
              <MatomoLink href="https://etherscan.io/address/0x388C818CA8B9251b393131C08a736A67ccB19297">
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
                  <MatomoLink href="https://etherscan.io/address/0x388C818CA8B9251b393131C08a736A67ccB19297">
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
