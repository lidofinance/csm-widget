import { Description, MessageBox, Stack } from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { CheckboxField, TokenSelectField } from 'shared/hook-form/fields';
import { LocalLink } from 'shared/navigate';
import { getClaimTokenOptions } from '../claim-token-options';
import {
  ClaimBondFormInputType,
  useClaimBondFlow,
  useClaimBondFormData,
} from '../context';
import { useWithdrawalWaitingTime } from '../hooks/use-withdrawal-waiting-time';

const EthNote: FC = () => (
  <Description color="secondary" data-testid="ethNote">
    <b>Note:</b> After receiving NFT you will need to claim ETH manually. Follow{' '}
    <LocalLink
      href={PATH.BOND_CLAIM}
      anchor="#how-to-claim-eth-using-a-withdrawal-nft"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.howToClaimEth}
    >
      FAQ
    </LocalLink>{' '}
    for more details.
  </Description>
);

export const TokenSelect: FC = () => {
  const [token, unlockedClaimTokens] = useWatch<
    ClaimBondFormInputType,
    ['token', 'unlockedClaimTokens']
  >({ name: ['token', 'unlockedClaimTokens'] });
  const {
    isContract,
    feeSplits,
    calculation: { claimableMaxValues },
  } = useClaimBondFormData(true);
  const flow = useClaimBondFlow();
  const { data: waitingTime } = useWithdrawalWaitingTime(
    claimableMaxValues?.[TOKENS.eth]?.[1],
  );

  if (flow.action !== 'claim' || !flow.showAmount) return null;
  const index = flow.maxValueIndex;

  return (
    <Stack direction="column" gap={16}>
      <TokenSelectField
        name="token"
        label="Choose a token to claim"
        subtitle={
          flow.includeRewards && feeSplits.length > 0
            ? 'Splitter addresses receive stETH. Choose the token for your Rewards Address.'
            : undefined
        }
        options={getClaimTokenOptions({
          maxValues: {
            [TOKENS.eth]: claimableMaxValues[TOKENS.eth][index],
            [TOKENS.steth]: claimableMaxValues[TOKENS.steth][index],
            [TOKENS.wsteth]: claimableMaxValues[TOKENS.wsteth][index],
          },
          ethWaitingTime: waitingTime?.text,
          contractLocked: isContract && !unlockedClaimTokens,
        })}
      />
      {isContract && (
        <>
          <MessageBox variant="warning">
            The Rewards Address of your Node Operator seems to be a smart
            contract. Please ensure the smart contract you use for the Reward
            Address is compatible with the chosen token for claiming of your
            bond/rewards.
          </MessageBox>
          <CheckboxField
            name="unlockedClaimTokens"
            label="I am fully aware of the risks and want to claim rewards in ETH/stETH anyway"
          />
        </>
      )}
      {token === TOKENS.eth && <EthNote />}
    </Stack>
  );
};
