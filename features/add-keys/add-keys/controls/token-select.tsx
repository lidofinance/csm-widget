import { TOKENS } from 'consts/tokens';
import {
  FormTitle,
  KeysAvailable,
  MatomoLink,
  Stack,
  TokenAmount,
} from 'shared/components';
import { TokenButtonsHookForm } from 'shared/hook-form/controls';
import { useAddKeysFormData } from '../context';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const TokenSelect: React.FC = () => {
  const { etherBalance, stethBalance, wstethBalance, keysAvailable, loading } =
    useAddKeysFormData();

  return (
    <>
      <FormTitle
        extra={
          <MatomoLink
            href="#how-bond-is-calculated"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.depositDataLearnMore}
          >
            How bond are calculated
          </MatomoLink>
        }
      >
        Choose bond token
      </FormTitle>
      <TokenButtonsHookForm
        options={{
          [TOKENS.ETH]: (
            <Stack direction="column">
              <TokenAmount
                token={TOKENS.ETH}
                amount={etherBalance}
                loading={loading.isEtherBalanceLoading}
              />
              <KeysAvailable {...keysAvailable?.ETH} token={TOKENS.ETH} />
            </Stack>
          ),
          [TOKENS.STETH]: (
            <Stack direction="column">
              <TokenAmount
                token={TOKENS.STETH}
                amount={stethBalance}
                loading={loading.isStethBalanceLoading}
              />
              <KeysAvailable {...keysAvailable?.STETH} token={TOKENS.STETH} />
            </Stack>
          ),
          [TOKENS.WSTETH]: (
            <Stack direction="column">
              <TokenAmount
                token={TOKENS.WSTETH}
                amount={wstethBalance}
                loading={loading.isWstethBalanceLoading}
              />
              <KeysAvailable {...keysAvailable?.WSTETH} token={TOKENS.WSTETH} />
            </Stack>
          ),
        }}
      ></TokenButtonsHookForm>
    </>
  );
};
