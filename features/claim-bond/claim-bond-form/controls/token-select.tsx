import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { Checkbox } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { useController, useWatch } from 'react-hook-form';
import {
  FormTitle,
  MatomoLink,
  Note,
  Stack,
  TokenAmount,
  WarningBlock,
  YouWillReceive,
} from 'shared/components';
import { TokenButtonsHookForm } from 'shared/hook-form/controls';
import { useExternalLinks } from 'shared/hooks';
import { LocalLink } from 'shared/navigate';
import { getTokenDisplayName } from 'utils';
import { ClaimBondFormInputType, useClaimBondFormData } from '../context';

export const TokenSelect: React.FC = () => {
  const [token, claimRewards] = useWatch<
    ClaimBondFormInputType,
    ['token', 'claimRewards']
  >({ name: ['token', 'claimRewards'] });
  const { loading, maxValues, isContract, isSplitter } = useClaimBondFormData();
  const isLoading = loading.isBondLoading || loading.isRewardsLoading;
  const { stakeWidget } = useExternalLinks();

  const { field: unlockField } = useController<
    ClaimBondFormInputType,
    'unlockClaimTokens'
  >({
    name: 'unlockClaimTokens',
  });

  return (
    <>
      <FormTitle>Choose a token to claim</FormTitle>
      {isContract && !isSplitter && (
        <WarningBlock>
          The Rewards Address of your Node Operator seems to be a smart
          contract. Please ensure the smart contract you use for the Reward
          Address is compatible with the chosen token for claiming of your
          bond/rewards.
        </WarningBlock>
      )}
      <TokenButtonsHookForm
        disabled={
          !maxValues?.[TOKENS.eth][Number(claimRewards)] ||
          (isSplitter && !unlockField.value)
        }
        options={{
          [TOKENS.eth]: (
            <Stack direction="column">
              <TokenAmount
                token={TOKENS.eth}
                amount={maxValues?.[TOKENS.eth][Number(claimRewards)]}
                loading={isLoading}
              />
              <YouWillReceive
                waitingTime={
                  <>
                    Check on{' '}
                    <MatomoLink href={`${stakeWidget}/withdrawals/request`}>
                      stake widget
                    </MatomoLink>
                  </>
                }
                receive="withdrawal NFT"
              />
            </Stack>
          ),
          [TOKENS.steth]: (
            <Stack direction="column">
              <TokenAmount
                token={TOKENS.steth}
                amount={maxValues?.[TOKENS.steth][Number(claimRewards)]}
                loading={isLoading}
              />
              <YouWillReceive
                waitingTime="~ 1 min"
                receive={getTokenDisplayName(TOKENS.steth)}
              />
            </Stack>
          ),
          [TOKENS.wsteth]: (
            <Stack direction="column">
              <TokenAmount
                token={TOKENS.wsteth}
                amount={maxValues?.[TOKENS.wsteth][Number(claimRewards)]}
                loading={isLoading || loading.isMaxValuesLoading}
              />
              <YouWillReceive
                waitingTime="~ 1 min"
                receive={getTokenDisplayName(TOKENS.wsteth)}
              />
            </Stack>
          ),
        }}
      />
      {token === TOKENS.eth && (
        <Note>
          After receiving NFT you will need to claim ETH manually. Follow{' '}
          <LocalLink
            href={PATH.BOND_CLAIM}
            anchor="#how-to-claim-eth-using-a-withdrawal-nft"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.howToClaimEth}
          >
            FAQ
          </LocalLink>{' '}
          for more details.
        </Note>
      )}
      {isSplitter && (
        <>
          <Note>
            The Rewards Address of your Node Operator is a splitter contract. It
            is strongly recommended to claim bond and rewards in wstETH only.
            ETH withdrawal NFT is not compatible with the splitter, while a
            rebasing token like stETH may not receive incremental rewards. More
            information can be found in the{' '}
            <MatomoLink
              href="https://docs.splits.org/core/split#how-it-works"
              matomoEvent={MATOMO_CLICK_EVENTS_TYPES.splitsOrgDocumentation}
            >
              splits.org documentation
            </MatomoLink>
            .
          </Note>
          <Checkbox
            label="I am fully aware of the risks and want to claim rewards in ETH/stETH anyway"
            {...unlockField}
            value=""
            checked={!!unlockField.value}
          />
        </>
      )}
    </>
  );
};
