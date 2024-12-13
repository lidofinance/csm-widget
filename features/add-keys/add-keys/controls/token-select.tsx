import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { BOND_EXCESS, BOND_INSUFFICIENT } from 'consts/text';
import { TOKENS } from 'consts/tokens';
import { PATH } from 'consts/urls';
import {
  FormTitle,
  KeysAvailable,
  Stack,
  TitledAmount,
  TokenAmount,
} from 'shared/components';
import { TokenButtonsHookForm } from 'shared/hook-form/controls';
import { LocalLink } from 'shared/navigate';
import { useAddKeysFormData } from '../context';

export const TokenSelect: React.FC = () => {
  const {
    etherBalance,
    stethBalance,
    wstethBalance,
    keysAvailable,
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
            How bond are calculated
          </LocalLink>
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
        token={TOKENS.STETH}
      />
    </>
  );
};
