import {
  CheckboxList,
  CheckboxRow,
  InfoTooltip,
  Stack,
  getFieldErrorId,
} from '@lidofinance/lido-app-ui';
import type { KEY_STATUS, KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { FC, ReactNode, useEffect, useId } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { FieldError } from './field-error';
import { getFieldErrorState } from './field-error-state';
import {
  EMPTY_KEY_RANGE,
  isInKeyRange,
  KeyListFieldMode,
  KeyRangeSelection,
  toggleKeyIndex,
  toggleKeyRange,
  trimPubkey,
} from './key-list-selection';
import { KeyStatusTag } from './key-status-tag';
import { KeyPubkeyStyle } from './styles';
import { useFocusableRef } from './use-focusable-ref';

export type KeyListFieldProps = {
  name: string;
  /** `range`: value `{ start, count }` over list positions; `multi`: value `number[]` of `KeyWithStatus.index`. */
  mode: KeyListFieldMode;
  options: KeyWithStatus[];
  'aria-label': string;
  /** Statuses shown as tags; defaults to all of the key's statuses. */
  getTags?: (key: KeyWithStatus) => KEY_STATUS[];
  isDisabled?: (key: KeyWithStatus) => boolean;
  /** Tooltip next to a disabled key, outside its label. */
  disabledHint?: ReactNode;
  'data-testid'?: string;
};

export const KeyListField: FC<KeyListFieldProps> = ({
  name,
  mode,
  options,
  'aria-label': ariaLabel,
  getTags = (key) => key.statuses,
  isDisabled,
  disabledHint,
  'data-testid': testId,
}) => {
  const { field, fieldState, formState } = useController({ name });
  const { setValue, trigger } = useFormContext();
  const ref = useFocusableRef(field.ref);
  const errorId = useId();

  // An empty selection is still a value: reveal "no keys" only after a toggle or submit
  const { invalid, message } = getFieldErrorState({
    error: fieldState.error,
    isTouched: fieldState.isTouched,
    isSubmitted: formState.isSubmitted,
    value: undefined,
  });

  // The CTA reads form errors: validate on mount so an empty selection disables it
  useEffect(() => {
    void trigger(name);
  }, [name, trigger]);

  const range: KeyRangeSelection = field.value ?? EMPTY_KEY_RANGE;
  const indexes: number[] = field.value ?? [];

  const isChecked = (key: KeyWithStatus, position: number) =>
    mode === 'range'
      ? isInKeyRange(range, position)
      : indexes.includes(key.index);

  const toggle = (key: KeyWithStatus, position: number) =>
    setValue(
      name,
      mode === 'range'
        ? toggleKeyRange(range, position)
        : toggleKeyIndex(indexes, key.index),
      { shouldValidate: true, shouldDirty: true, shouldTouch: true },
    );

  return (
    <Stack gap={12} ref={ref}>
      <CheckboxList
        role="group"
        aria-label={ariaLabel}
        error={invalid}
        aria-describedby={message ? getFieldErrorId(errorId) : undefined}
        data-testid={testId}
      >
        {options.map((key, position) => {
          const disabled = isDisabled?.(key) ?? false;

          return (
            <CheckboxRow
              key={`${key.index}-${key.pubkey}`}
              mono
              dataTestId={{ root: 'keyRow' }}
              checked={isChecked(key, position)}
              disabled={disabled}
              onChange={() => toggle(key, position)}
              onBlur={field.onBlur}
              label={
                <KeyPubkeyStyle title={key.pubkey}>
                  <span>{trimPubkey(key.pubkey, 16)}</span>
                  <span>{trimPubkey(key.pubkey, 6)}</span>
                </KeyPubkeyStyle>
              }
              trailing={
                <Stack
                  direction="row"
                  wrap
                  align="center"
                  justify="end"
                  gap={4}
                >
                  {getTags(key).map((status) => (
                    <KeyStatusTag key={status} status={status} />
                  ))}
                  {disabled && disabledHint != null && (
                    <InfoTooltip content={disabledHint} position="left" />
                  )}
                </Stack>
              }
            />
          );
        })}
      </CheckboxList>
      <FieldError id={errorId}>{message}</FieldError>
    </Stack>
  );
};
