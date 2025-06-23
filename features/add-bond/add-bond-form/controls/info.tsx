import { BOND_INSUFFICIENT } from 'consts/text';
import { TOKENS } from 'consts/tokens';
import { FC } from 'react';
import { Latice, MatomoLink, Stack, TitledAmount } from 'shared/components';
import { useAddBondFormData } from '../context';

export const Info: FC = () => {
  const { bond, loading } = useAddBondFormData();

  return (
    <>
      <Latice variant="secondary">
        <Stack direction="column" gap="sm" data-testid="formInfo">
          <TitledAmount
            warning={bond?.isInsufficient}
            title={bond?.isInsufficient ? BOND_INSUFFICIENT : 'Bond balance'}
            help={
              bond?.isInsufficient
                ? 'Insufficient bond is the missing amount of stETH required to cover all operator’s keys.  In case of a bond insufficient, "unbonded" validators are requested for exit by the protocol'
                : undefined
            }
            loading={loading.isBondLoading}
            amount={bond?.delta}
            token={TOKENS.STETH}
          />
          {bond?.isInsufficient ? (
            <p>
              Your Node Operator has an Insufficient bond because of the penalty
              applied. Now your Node Operator&apos;s bond is less than required
              to cover the Node Operator&apos;s current validators.
              <br />
              <b>Action required:</b>
              <br />
              Top up the bond by submitting the required difference to be able
              to claim new rewards and to prevent your validator becoming
              unbonded and being requested to exit.
            </p>
          ) : (
            <p>
              <b>Why you might need to add bond:</b>
              <br />
              Adding a bond serves as a voluntary security measure for your Node
              Operator to prevent your validators from becoming{' '}
              <MatomoLink href="https://docs.lido.fi/staking-modules/csm/guides/unbonded-validators">
                unbonded
              </MatomoLink>{' '}
              and being requested to exit in case of applied penalties.
              <br />
              Supplied bond will be stored as stETH, which also garners staking
              rewards.
            </p>
          )}
        </Stack>
      </Latice>
    </>
  );
};
