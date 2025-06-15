import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { BOND_EXCESS, BOND_INSUFFICIENT } from 'consts/text';
import { PATH } from 'consts/urls';
import {
  FormTitle,
  // KeysAvailable,
  Stack,
  TitledAmount,
  TokenAmount,
} from 'shared/components';
import { TokenButtonsHookForm } from 'shared/hook-form/controls';
import { LocalLink } from 'shared/navigate';
import { useAddKeysFormData } from '../context';
import { TOKENS } from '@lidofinance/lido-csm-sdk';

export const TokenSelect: React.FC = () => {
  const {
    ethBalance,
    stethBalance,
    wstethBalance,
    // keysAvailable,
    bond,
    loading,
  } = useAddKeysFormData();

  return (
    <>
      <FormTitle
        extra={
          <LocalLink
            href={PATH.KEYS_SUBMIT}
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
              {/* <KeysAvailable {...keysAvailable?.ETH} token={TOKENS.ETH} /> */}
            </Stack>
          ),
          [TOKENS.steth]: (
            <Stack direction="column">
              <TokenAmount
                token={TOKENS.steth}
                amount={stethBalance}
                loading={loading.isStethBalanceLoading}
              />
              {/* <KeysAvailable {...keysAvailable?.STETH} token={TOKENS.STETH} /> */}
            </Stack>
          ),
          [TOKENS.wsteth]: (
            <Stack direction="column">
              <TokenAmount
                token={TOKENS.wsteth}
                amount={wstethBalance}
                loading={loading.isWstethBalanceLoading}
              />
              {/* <KeysAvailable {...keysAvailable?.WSTETH} token={TOKENS.WSTETH} /> */}
            </Stack>
          ),
        }}
      />
      <TitledAmount
        title={bond?.isInsufficient ? BOND_INSUFFICIENT : BOND_EXCESS}
        description={
          bond?.isInsufficient
            ? 'Will be added to the transaction amount'
            : 'Will be subtracted from the transaction amount'
        }
        loading={loading.isBondLoading}
        amount={bond?.delta}
        token={TOKENS.steth}
      />
    </>
  );
};
