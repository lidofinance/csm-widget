import type { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { SectionTitle } from '@lidofinance/lido-app-ui';
import { FC, ReactNode, useCallback, useState } from 'react';
import {
  useController,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import { Dropzone } from 'shared/ui';
import { readFileAsText } from 'utils/read-file-as-text';
import {
  DepositDataInputType,
  DepositDataParameters,
  DepositDataParsed,
  useIsWcTypeMismatch,
  useParseDepositData,
  WcTypeWarning,
} from '../deposit-data';
import {
  DepositDataTab,
  getDepositDataState,
  getDepositDataTabItems,
} from './deposit-data-state';
import { FieldStackStyle } from './styles';
import { useFocusableRef } from './use-focusable-ref';

export const DEPOSIT_DATA_ERROR_TEST_ID = 'input-message-error';
export const DEPOSIT_DATA_ACCEPT = '.json,application/json,text/json';

export type DepositDataFieldProps = {
  module?: MODULE_NAME;
  label?: string;
  action?: ReactNode;
  showGuideNote?: boolean;
};

// Dropzone shows its textarea only while children is nullish
const TAB_CONTENT: Record<DepositDataTab, ReactNode> = {
  json: undefined,
  parsed: <DepositDataParsed />,
  parameters: <DepositDataParameters />,
};

const Placeholder: FC<{ showGuideNote?: boolean }> = ({ showGuideNote }) =>
  showGuideNote ? (
    <>
      <span>Paste JSON with deposit data or drag and drop the file.</span>
      <span>
        Please make sure you followed the key generation guide provided in FAQ.
      </span>
    </>
  ) : (
    <span>Paste JSON with deposit data or drag and drop the file</span>
  );

export const DepositDataField: FC<DepositDataFieldProps> = ({
  module,
  label,
  action,
  showGuideNote,
}) => {
  const { field } = useController<DepositDataInputType, 'rawDepositData'>({
    name: 'rawDepositData',
  });
  const { setValue } = useFormContext<DepositDataInputType>();
  const depositData = useWatch<DepositDataInputType, 'depositData'>({
    name: 'depositData',
  });
  const { errors } = useFormState<DepositDataInputType>({
    name: ['depositData', 'rawDepositData'],
  });
  const { hasKeys, errorsCount, highlight, message } = getDepositDataState({
    keysCount: depositData?.length ?? 0,
    rawError: errors.rawDepositData,
    depositDataError: errors.depositData,
  });
  const isWcTypeMismatch = useIsWcTypeMismatch(module);
  const ref = useFocusableRef(field.ref, 'textarea');
  const [tab, setTab] = useState<DepositDataTab>('json');
  const activeTab = hasKeys ? tab : 'json';

  useParseDepositData();

  const handleFiles = useCallback(
    (files: File[]) => {
      void readFileAsText(files[0])
        .then((text) =>
          setValue('rawDepositData', text, {
            shouldValidate: false,
            shouldDirty: true,
            shouldTouch: true,
          }),
        )
        .catch(() => undefined);
    },
    [setValue],
  );

  const error =
    highlight &&
    (message && !isWcTypeMismatch ? (
      <span data-testid={DEPOSIT_DATA_ERROR_TEST_ID}>{message}</span>
    ) : (
      true
    ));

  return (
    <FieldStackStyle ref={ref}>
      {label && <SectionTitle title={label} action={action} />}
      <Dropzone
        name={field.name}
        value={field.value ?? ''}
        onChange={field.onChange}
        onBlur={field.onBlur}
        onFiles={handleFiles}
        accept={DEPOSIT_DATA_ACCEPT}
        placeholder={<Placeholder showGuideNote={showGuideNote} />}
        error={error}
        disabled={field.disabled}
        tabs={{
          items: getDepositDataTabItems({ hasKeys, errorsCount }),
          value: activeTab,
          onChange: (value) => setTab(value as DepositDataTab),
        }}
      >
        {TAB_CONTENT[activeTab]}
      </Dropzone>
      {isWcTypeMismatch && <WcTypeWarning />}
    </FieldStackStyle>
  );
};
