import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import {
  FormTitle,
  // KeysAvailable,
  Stack,
  TokenAmount,
} from 'shared/components';
import { TokenButtonsHookForm } from 'shared/hook-form/controls';
import { LocalLink } from 'shared/navigate';
import { useSubmitKeysFormData } from '../context';
import { TOKENS } from '@lidofinance/lido-csm-sdk/common';

export const TokenSelect: React.FC = () => {
  const { ethBalance, stethBalance, wstethBalance, loading } =
    useSubmitKeysFormData();

  return (
    <>
      <FormTitle
        extra={
          <LocalLink
            href={PATH.CREATE}
            anchor="#how-bond-is-calculated"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.depositDataLearnMore}
          >
            How bond is calculated
          </LocalLink>
        }
      >
        Choose bond token
      </FormTitle>
      <TokenButtonsHookForm
        options={{
          [TOKENS.eth]: (
            <Stack direction="column">
              <TokenAmount
                token={TOKENS.eth}
                amount={ethBalance}
                loading={loading.isEthBalanceLoading}
              />
              {/* <KeysAvailable {...keysAvailable?.ETH} token={TOKENS.eth} /> */}
            </Stack>
          ),
          [TOKENS.steth]: (
            <Stack direction="column">
              <TokenAmount
                token={TOKENS.steth}
                amount={stethBalance}
                loading={loading.isStethBalanceLoading}
              />
              {/* <KeysAvailable {...keysAvailable?.STETH} token={TOKENS.steth} /> */}
            </Stack>
          ),
          [TOKENS.wsteth]: (
            <Stack direction="column">
              <TokenAmount
                token={TOKENS.wsteth}
                amount={wstethBalance}
                loading={loading.isWstethBalanceLoading}
              />
              {/* <KeysAvailable {...keysAvailable?.WSTETH} token={TOKENS.wsteth} /> */}
            </Stack>
          ),
        }}
      />
    </>
  );
};
