import { TOKENS } from 'consts/tokens';
import {
  FormTitle,
  KeysAvailable,
  Stack,
  TokenAmount,
} from 'shared/components';
import { TokenButtonsHookForm } from 'shared/hook-form/controls';
import { useSubmitKeysFormData } from '../context';

export const TokenSelect: React.FC = () => {
  const { etherBalance, stethBalance, wstethBalance, keysAvailable, loading } =
    useSubmitKeysFormData();

  return (
    <>
      <FormTitle>Choose a token to upload a bond</FormTitle>
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
