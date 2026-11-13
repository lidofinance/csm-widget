import { Counter, SegmentItem, Stack } from '@lidofinance/lido-app-ui';
import { isValidationErrorTypeValidate } from '../validation/validation-error';

export type DepositDataTab = 'json' | 'parsed' | 'parameters';

type DepositDataError = {
  type?: string;
  message?: string;
  types?: Record<string, unknown>;
};

export type DepositDataStateInput = {
  keysCount: number;
  rawError?: DepositDataError;
  depositDataError?: DepositDataError;
};

export type DepositDataState = {
  hasKeys: boolean;
  errorsCount: number;
  highlight: boolean;
  message?: string;
};

export const getDepositDataState = ({
  keysCount,
  rawError,
  depositDataError,
}: DepositDataStateInput): DepositDataState => {
  const error = rawError || depositDataError;
  const hasKeys = keysCount > 0;
  const types = depositDataError?.types;
  const highlight = isValidationErrorTypeValidate(error?.type);

  return {
    hasKeys,
    errorsCount: hasKeys && types ? Object.keys(types).length : 0,
    highlight,
    message: (highlight && error?.message) || undefined,
  };
};

export const getDepositDataTabItems = ({
  hasKeys,
  errorsCount,
}: Pick<DepositDataState, 'hasKeys' | 'errorsCount'>): SegmentItem[] => [
  { value: 'json', label: 'JSON', dataTestId: { root: 'tab-button-JSON' } },
  {
    value: 'parsed',
    label: (
      <Stack as="span" inline direction="row" align="center" gap={6}>
        Parsed
        {errorsCount > 0 && (
          <Counter
            variant="error"
            dataTestId={{ root: 'depositDataErrorsCounter' }}
          >
            {errorsCount}
          </Counter>
        )}
      </Stack>
    ),
    disabled: !hasKeys,
    dataTestId: { root: 'tab-button-Parsed' },
  },
  {
    value: 'parameters',
    label: 'Parameters',
    disabled: !hasKeys,
    dataTestId: { root: 'tab-button-Parameters' },
  },
];
