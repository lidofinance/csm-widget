import { TOKENS } from 'consts/tokens';
import { useWatch } from 'react-hook-form';
import {
  FormTitle,
  MatomoLink,
  Note,
  Stack,
  TokenAmount,
  YouWillReceive,
} from 'shared/components';
import { TokenButtonsHookForm } from 'shared/hook-form/controls';
import { getTokenDisplayName } from 'utils';
import { ClaimBondFormInputType, useClaimBondFormData } from '../context';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const TokenSelect: React.FC = () => {
  const [token, claimRewards] = useWatch<
    ClaimBondFormInputType,
    ['token', 'claimRewards']
  >({ name: ['token', 'claimRewards'] });
  const { loading, maxValues } = useClaimBondFormData();
  const isLoading = loading.isBondLoading || loading.isRewardsLoading;

  return (
    <>
      <FormTitle>Choose a token to claim</FormTitle>
      <TokenButtonsHookForm
        disabled={maxValues?.[TOKENS.ETH][Number(claimRewards)]?.eq(0)}
        options={{
          [TOKENS.ETH]: (
            <Stack direction="column">
              <TokenAmount
                token={TOKENS.ETH}
                amount={maxValues?.[TOKENS.ETH][Number(claimRewards)]}
                loading={isLoading}
              />
              <YouWillReceive
                waitingTime="~ 1-5 days"
                receive="withdrawal NFT"
              />
            </Stack>
          ),
          [TOKENS.STETH]: (
            <Stack direction="column">
              <TokenAmount
                token={TOKENS.STETH}
                amount={maxValues?.[TOKENS.STETH][Number(claimRewards)]}
                loading={isLoading}
              />
              <YouWillReceive
                waitingTime="~ 1 min"
                receive={getTokenDisplayName(TOKENS.STETH)}
              />
            </Stack>
          ),
          [TOKENS.WSTETH]: (
            <Stack direction="column">
              <TokenAmount
                token={TOKENS.WSTETH}
                amount={maxValues?.[TOKENS.WSTETH][Number(claimRewards)]}
                loading={isLoading || loading.isMaxValuesLoading}
              />
              <YouWillReceive
                waitingTime="~ 1 min"
                receive={getTokenDisplayName(TOKENS.WSTETH)}
              />
            </Stack>
          ),
        }}
      />
      {token === TOKENS.ETH && (
        <Note>
          After receiving NFT you will need to claim ETH manually. Follow{' '}
          <MatomoLink
            href="#how-to-claim-eth"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.howToClaimEth}
          >
            FAQ
          </MatomoLink>{' '}
          for more details.
        </Note>
      )}
    </>
  );
};
