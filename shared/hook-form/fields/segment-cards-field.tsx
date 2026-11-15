import {
  getFieldErrorId,
  SegmentedControlCard,
  type SegmentCardItem,
  Stack,
} from '@lidofinance/lido-app-ui';
import { FC, useId } from 'react';
import { FieldError } from './field-error';
import { useFieldController } from './use-field-controller';
import { useFocusableRef } from './use-focusable-ref';

const SEGMENT_TAB_STOP_SELECTOR = '[role="tab"]:not([disabled])';

export type SegmentCardsFieldOption = SegmentCardItem;

export type SegmentCardsFieldProps = {
  name: string;
  options: SegmentCardsFieldOption[];
  'aria-label': string;
  showUntouched?: boolean;
  required?: boolean;
  'data-testid'?: string;
};

export const SegmentCardsField: FC<SegmentCardsFieldProps> = ({
  name,
  options,
  'aria-label': ariaLabel,
  showUntouched,
  required,
  'data-testid': testId,
}) => {
  const { field, invalid, message } = useFieldController({
    name,
    rules: { required },
    showUntouched,
  });
  const ref = useFocusableRef(field.ref, SEGMENT_TAB_STOP_SELECTOR);
  const errorId = useId();

  return (
    <Stack direction="column" gap={12} ref={ref}>
      <SegmentedControlCard
        stackAt={490}
        items={options}
        value={field.value ?? ''}
        onChange={field.onChange}
        onBlur={field.onBlur}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        aria-describedby={message ? getFieldErrorId(errorId) : undefined}
        dataTestId={{ root: testId }}
      />
      <FieldError id={errorId}>{message}</FieldError>
    </Stack>
  );
};
