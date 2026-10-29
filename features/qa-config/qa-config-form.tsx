import { Fragment, useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { MODULE_NAME, SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import {
  Block,
  Button,
  Input,
  Option,
  Select,
  ToastSuccess,
} from '@lidofinance/lido-ui';

import { config, useConfig } from 'config';
import { getOverridableModules } from 'config/resolve-module-override';
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
const IPFS_GATEWAYS_KEY = 'ipfsGateways';
const SURVEY_API_URL_KEY = 'surveyApiUrl';
const MODULE_KEY = 'module';
const DEFAULT_MODULE_OPTION = 'default';
const MODULE_OPTIONS = getOverridableModules(config.defaultChain);
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

  const {
    config: { envModule },
  } = useConfig();

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
    values[MODULE_KEY] =
      savedUserConfig.module && MODULE_OPTIONS.includes(savedUserConfig.module)
        ? savedUserConfig.module
        : DEFAULT_MODULE_OPTION;
    return values;
  }, [rows, savedUserConfig]);

  const { register, control, handleSubmit, reset, formState } =
    useForm<FormValues>({
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

      const moduleValue = values[MODULE_KEY];
      const moduleName =
        moduleValue === DEFAULT_MODULE_OPTION
          ? undefined
          : (moduleValue as MODULE_NAME);

      setSavedUserConfig({
        rpcUrls,
        clApiUrls,
        ipfsGateways,
        surveyApiUrl,
        module: moduleName,
      });
      ToastSuccess('QA config saved. Reload the page to apply.');
    },
    [rows, setSavedUserConfig],
  );

  const handleReset = useCallback(() => {
    resetSavedUserConfig();

    const empty: FormValues = {};
    for (const key of Object.keys(defaultValues)) empty[key] = '';
    empty[MODULE_KEY] = DEFAULT_MODULE_OPTION;
    reset(empty);

    ToastSuccess('QA config reset to defaults');
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
          <Input
            fullwidth
            label="IPFS gateway"
            placeholder="https://ipfs.io/ipfs/{cid}, https://{cid}.ipfs.dweb.link"
            error={formState.errors[IPFS_GATEWAYS_KEY]?.message}
            {...register(IPFS_GATEWAYS_KEY, { validate: validateGateways })}
          />
          <Input
            fullwidth
            label="Surveys API URL"
            placeholder="https://csm-surveys-api-mainnet.up.railway.app"
            error={formState.errors[SURVEY_API_URL_KEY]?.message}
            {...register(SURVEY_API_URL_KEY, { validate: validateUrl })}
          />
          <Controller
            control={control}
            name={MODULE_KEY}
            render={({ field }) => (
              <Select
                fullwidth
                label="Module"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              >
                <Option
                  value={DEFAULT_MODULE_OPTION}
                >{`Default (${envModule})`}</Option>
                {MODULE_OPTIONS.map((name) => (
                  <Option key={name} value={name}>
                    {name}
                  </Option>
                ))}
              </Select>
            )}
          />
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
            Override the JSON-RPC endpoint, Consensus Layer API base URL, IPFS
            gateway, and Surveys API base URL used by the widget. Intended for
            QA against custom forks or staging backends — not for end users.
          </p>
          <p>
            The IPFS gateway is tried before the default public gateways and may
            include a <code>{'{cid}'}</code> placeholder; otherwise the CID is
            appended to the URL
          </p>
          <p>
            Values are stored in <code>localStorage</code> under{' '}
            <code>lido-user-config</code> and persist across reloads. Leave a
            field empty to fall back to the default backend proxy.
          </p>
          <p>
            The module override replaces the deployment&apos;s module for this
            browser after a reload; <code>?module=cm</code> seeds it,{' '}
            <code>?module=default</code> clears it. Server-rendered parts
            (favicon, manifest, meta tags) keep the deployment&apos;s module.
          </p>
          <p>
            <strong>Reload the page after saving</strong> for the new endpoints
            to be picked up everywhere
          </p>
        </Description>
      </Block>
    </>
  );
};
