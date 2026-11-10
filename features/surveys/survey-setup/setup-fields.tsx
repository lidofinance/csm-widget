import { Field, Stack, Tag } from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Plural } from 'shared/components';
import {
  AmountField,
  CheckboxField,
  NumberField,
  SelectField,
} from 'shared/hook-form/fields';
import { Setup } from '../types';
import {
  CL_CLIENT_OPTIONS,
  COUNTRY_OPTIONS,
  DVT_OPTIONS,
  EL_CLIENT_OPTIONS,
  REMOTE_SIGNER_OPTIONS,
  SERVER_TYPE_OPTIONS,
  TOOL_OPTIONS,
  VALIDATOR_CLIENT_OPTIONS,
} from './options';

type SetupFieldsProps = {
  /** Keys still free for this setup; `undefined` until the keys summary loads. */
  keysLeft?: number;
  maxKeys: number;
};

export const SetupFields: FC<SetupFieldsProps> = ({ keysLeft, maxKeys }) => {
  const { setValue } = useFormContext<Setup>();
  const validatorSameAsCl = useWatch<Setup, 'validatorSameAsCl'>({
    name: 'validatorSameAsCl',
  });
  const keysCount = useWatch<Setup, 'keysCount'>({ name: 'keysCount' });
  const keysRemain = Math.max(0, (keysLeft ?? 0) - (keysCount ?? 0));

  return (
    <Stack gap={32}>
      <NumberField
        name="keysCount"
        label="Number of keys in this setup"
        placeholder="Number"
        required
        min={1}
        minMessage="Minimum keys amount is 1"
        max={maxKeys}
        maxMessage={`Maximum keys amount is ${maxKeys}`}
        trailing={
          keysLeft !== undefined && (
            <Tag
              variant="neutral"
              onClick={() => setValue('keysCount', keysLeft)}
            >
              {keysRemain}{' '}
              <Plural value={keysRemain} variants={['key', 'keys']} /> left
            </Tag>
          )
        }
      />
      <SelectField
        name="dvt"
        label="Are you using Distributed Validator Technology to run these validators?"
        options={DVT_OPTIONS}
        required
      />
      <SelectField
        name="installationTool"
        label="Which tool do you use to run your nodes/keys?"
        options={TOOL_OPTIONS}
        required
      />
      <SelectField
        name="elClient"
        label="Which Execution Layer Client are you running?"
        options={EL_CLIENT_OPTIONS}
        required
      />
      <SelectField
        name="clClient"
        label="Which Consensus Layer Client are you running?"
        options={CL_CLIENT_OPTIONS}
        required
      />
      <SelectField
        name="clientsServerType"
        label="What type of servers are your EL and CL nodes running on?"
        options={SERVER_TYPE_OPTIONS}
        required
      />
      <SelectField
        name="clientsCountry"
        label="Which country are your EL and CL nodes in?"
        options={COUNTRY_OPTIONS}
      />
      <Field
        id="validatorSameAsCl"
        label="Which Validator Client are you running?"
        group
      >
        <Stack gap={12}>
          <CheckboxField
            name="validatorSameAsCl"
            label="My Consensus Layer and Validator Client are the same"
          />
          {!validatorSameAsCl && (
            <SelectField
              name="validatorClient"
              aria-label="Validator Client"
              options={VALIDATOR_CLIENT_OPTIONS}
              required
            />
          )}
        </Stack>
      </Field>
      {!validatorSameAsCl && (
        <>
          <SelectField
            name="validatorServerType"
            label="What type of servers are your Validator Clients running on?"
            options={SERVER_TYPE_OPTIONS}
            required
          />
          <SelectField
            name="validatorCountry"
            label="Which country are your Validator Clients in?"
            options={COUNTRY_OPTIONS}
          />
        </>
      )}
      <SelectField
        name="remoteSigner"
        label="Do you use a remote signer for your validator keys?"
        options={REMOTE_SIGNER_OPTIONS}
        required
      />
      <AmountField
        name="mevMinBidWei"
        label="What is your MEV-boost min-bid value?"
        token={TOKENS.eth}
        placeholder="Number"
      />
    </Stack>
  );
};
