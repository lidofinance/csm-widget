import { Fragment, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import {
  Body,
  Button,
  Card,
  Input,
  Stack,
  toast,
} from '@lidofinance/lido-app-ui';
import { SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import { useUserConfig } from 'config/user-config';
import { CHAIN_METADATA } from 'consts/chains';
import { StretchCard, StretchStack } from 'shared/components';
import { isUrl } from 'utils/is-url';

type FormValues = Record<string, string>;

type ChainRow = {
  chainId: SUPPORTED_CHAINS;
  name: string;
  withCl: boolean;
};

const rpcKey = (chainId: SUPPORTED_CHAINS) => `rpc_${chainId}`;
const clKey = (chainId: SUPPORTED_CHAINS) => `cl_${chainId}`;
const IPFS_GATEWAYS_KEY = 'ipfsGateways';
const SURVEY_API_URL_KEY = 'surveyApiUrl';
const SAMPLE_CID = '1';

const resolveGateway = (url: string) => url.replaceAll('{cid}', SAMPLE_CID);

const validateUrl = (value: string) =>
  !value || isUrl(value) || 'Not a valid URL';

const parseGateways = (value: string): string[] =>
  value
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);

const validateGateways = (value: string) => {
  const invalid = parseGateways(value).find(
    (url) => !isUrl(resolveGateway(url)),
  );
  return !invalid || `Not a valid URL: ${invalid}`;
};

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
    values[IPFS_GATEWAYS_KEY] = savedUserConfig.ipfsGateways.join(', ');
    values[SURVEY_API_URL_KEY] = savedUserConfig.surveyApiUrl ?? '';
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

      const ipfsGateways = parseGateways(values[IPFS_GATEWAYS_KEY] ?? '');
      const surveyApiUrl = values[SURVEY_API_URL_KEY]?.trim() || undefined;

      setSavedUserConfig({ rpcUrls, clApiUrls, ipfsGateways, surveyApiUrl });
      toast('QA endpoints saved. Reload the page to apply.');
    },
    [rows, setSavedUserConfig],
  );

  const handleReset = useCallback(() => {
    resetSavedUserConfig();

    const empty: FormValues = {};
    for (const key of Object.keys(defaultValues)) empty[key] = '';
    reset(empty);

    toast('QA endpoints reset to defaults');
  }, [defaultValues, reset, resetSavedUserConfig]);

  return (
    <>
      <StretchCard>
        <form onSubmit={handleSubmit(save)} noValidate>
          <StretchStack gap={16}>
            {rows.map(({ chainId, name, withCl }) => (
              <Fragment key={chainId}>
                <Input
                  label={`${name} — RPC URL`}
                  error={formState.errors[rpcKey(chainId)]?.message}
                  {...register(rpcKey(chainId), { validate: validateUrl })}
                />
                {withCl && (
                  <Input
                    label={`${name} — CL API URL`}
                    error={formState.errors[clKey(chainId)]?.message}
                    {...register(clKey(chainId), { validate: validateUrl })}
                  />
                )}
              </Fragment>
            ))}
            <Input
              label="IPFS gateway"
              placeholder="https://ipfs.io/ipfs/{cid}, https://{cid}.ipfs.dweb.link"
              error={formState.errors[IPFS_GATEWAYS_KEY]?.message}
              {...register(IPFS_GATEWAYS_KEY, { validate: validateGateways })}
            />
            <Input
              label="Surveys API URL"
              placeholder="https://csm-surveys-api-mainnet.up.railway.app"
              error={formState.errors[SURVEY_API_URL_KEY]?.message}
              {...register(SURVEY_API_URL_KEY, { validate: validateUrl })}
            />
            <Stack direction="row" gap={16}>
              <Button
                variant="subtle"
                fullWidth
                type="button"
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button fullWidth type="submit" disabled={!formState.isValid}>
                Save
              </Button>
            </Stack>
          </StretchStack>
        </form>
      </StretchCard>

      <Card>
        <Stack gap={8}>
          <Body>
            Override the JSON-RPC endpoint, Consensus Layer API base URL, IPFS
            gateway, and Surveys API base URL used by the widget. Intended for
            QA against custom forks or staging backends — not for end users.
          </Body>
          <Body>
            The IPFS gateway is tried before the default public gateways and may
            include a <code>{'{cid}'}</code> placeholder; otherwise the CID is
            appended to the URL
          </Body>
          <Body>
            Values are stored in <code>localStorage</code> under{' '}
            <code>lido-user-config</code> and persist across reloads. Leave a
            field empty to fall back to the default backend proxy.
          </Body>
          <Body>
            <strong>Reload the page after saving</strong> for the new endpoints
            to be picked up everywhere
          </Body>
        </Stack>
      </Card>
    </>
  );
};
