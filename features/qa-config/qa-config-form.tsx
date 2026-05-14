import { Fragment, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { Block, Button, Input, ToastSuccess } from '@lidofinance/lido-ui';

import { useUserConfig } from 'config/user-config';
import { CHAIN_METADATA } from 'consts/chains';
import { FormBlock, Stack } from 'shared/components';
import { isUrl } from 'utils/is-url';

import { Description } from './styles';

type FormValues = Record<string, string>;

type ChainRow = {
  chainId: SUPPORTED_CHAINS;
  name: string;
  withCl: boolean;
};

const rpcKey = (chainId: SUPPORTED_CHAINS) => `rpc_${chainId}`;
const clKey = (chainId: SUPPORTED_CHAINS) => `cl_${chainId}`;

const validateUrl = (value: string) =>
  !value || isUrl(value) || 'Not a valid URL';

export const QaConfigForm = () => {
  const {
    savedUserConfig,
    setSavedUserConfig,
    resetSavedUserConfig,
    defaultChain,
  } = useUserConfig();

  const rows = useMemo<ChainRow[]>(() => {
    const list: ChainRow[] = [
      {
        chainId: CHAINS.Mainnet,
        name: CHAIN_METADATA[CHAINS.Mainnet].name,
        withCl: defaultChain === CHAINS.Mainnet,
      },
    ];
    if (defaultChain !== CHAINS.Mainnet) {
      list.push({
        chainId: defaultChain,
        name: CHAIN_METADATA[defaultChain].name,
        withCl: true,
      });
    }
    return list;
  }, [defaultChain]);

  const defaultValues = useMemo<FormValues>(() => {
    const values: FormValues = {};
    for (const { chainId, withCl } of rows) {
      values[rpcKey(chainId)] = savedUserConfig.rpcUrls[chainId] ?? '';
      if (withCl) {
        values[clKey(chainId)] = savedUserConfig.clApiUrls[chainId] ?? '';
      }
    }
    return values;
  }, [rows, savedUserConfig]);

  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues,
  });

  const save = useCallback(
    (values: FormValues) => {
      const rpcUrls: Partial<Record<SUPPORTED_CHAINS, string>> = {};
      const clApiUrls: Partial<Record<SUPPORTED_CHAINS, string>> = {};

      for (const { chainId, withCl } of rows) {
        const rpc = values[rpcKey(chainId)]?.trim();
        if (rpc) rpcUrls[chainId] = rpc;
        if (withCl) {
          const cl = values[clKey(chainId)]?.trim();
          if (cl) clApiUrls[chainId] = cl;
        }
      }

      setSavedUserConfig({ rpcUrls, clApiUrls });
      ToastSuccess('QA endpoints saved. Reload the page to apply.');
    },
    [rows, setSavedUserConfig],
  );

  const handleReset = useCallback(() => {
    resetSavedUserConfig();

    const empty: FormValues = {};
    for (const key of Object.keys(defaultValues)) empty[key] = '';
    reset(empty);

    ToastSuccess('QA endpoints reset to defaults');
  }, [defaultValues, reset, resetSavedUserConfig]);

  return (
    <>
      <FormBlock>
        <form onSubmit={handleSubmit(save)} noValidate>
          {rows.map(({ chainId, name, withCl }) => (
            <Fragment key={chainId}>
              <Input
                fullwidth
                label={`${name} — RPC URL`}
                error={formState.errors[rpcKey(chainId)]?.message}
                {...register(rpcKey(chainId), { validate: validateUrl })}
              />
              {withCl && (
                <Input
                  fullwidth
                  label={`${name} — CL API URL`}
                  error={formState.errors[clKey(chainId)]?.message}
                  {...register(clKey(chainId), { validate: validateUrl })}
                />
              )}
            </Fragment>
          ))}
          <Stack>
            <Button
              fullwidth
              variant="translucent"
              type="button"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              fullwidth
              type="submit"
              color="primary"
              disabled={!formState.isValid}
            >
              Save
            </Button>
          </Stack>
        </form>
      </FormBlock>

      <Block>
        <Description>
          <p>
            Override the JSON-RPC endpoint and Consensus Layer API base URL used
            by the widget. Intended for QA against custom forks or staging
            backends — not for end users.
          </p>
          <p>
            Values are stored in <code>localStorage</code> under{' '}
            <code>lido-user-config</code> and persist across reloads. Leave a
            field empty to fall back to the default backend proxy.
          </p>
          <p>
            <strong>Reload the page after saving</strong> for the new endpoints
            to be picked up everywhere.
          </p>
        </Description>
      </Block>
    </>
  );
};
