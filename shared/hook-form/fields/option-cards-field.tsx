import { Stack, getFieldErrorId } from '@lidofinance/lido-app-ui';
import { FC, useId } from 'react';
import {
  OptionList,
  OptionListItem,
  OptionListItemProps,
  OptionListOrientation,
  OptionListVariant,
} from 'shared/ui';
import { FieldError } from './field-error';
import { useFieldController } from './use-field-controller';
import { useFocusableRef } from './use-focusable-ref';

export const OPTION_TAB_STOP_SELECTOR = '[role="radio"][tabindex="0"]';

export type OptionCardsFieldOption = Pick<
  OptionListItemProps,
  | 'value'
  | 'title'
  | 'description'
  | 'icon'
  | 'tags'
  | 'disabled'
  | 'children'
  | 'data-testid'
>;

export type OptionCardsFieldProps = {
  name: string;
  options: OptionCardsFieldOption[];
  'aria-label': string;
  variant?: OptionListVariant;
  orientation?: OptionListOrientation;
  showUntouched?: boolean;
  'data-testid'?: string;
};

export const OptionCardsField: FC<OptionCardsFieldProps> = ({
  name,
  options,
  'aria-label': ariaLabel,
  variant = 'cards',
  orientation,
  showUntouched,
  'data-testid': testId,
}) => {
  const { field, invalid, message } = useFieldController({
    name,
    showUntouched,
  });
  const ref = useFocusableRef(field.ref, OPTION_TAB_STOP_SELECTOR);
  const errorId = useId();

  return (
    <Stack gap={12} ref={ref}>
      <OptionList
        value={field.value ?? ''}
        onChange={field.onChange}
        onBlur={field.onBlur}
        variant={variant}
        orientation={orientation}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        aria-describedby={message ? getFieldErrorId(errorId) : undefined}
        data-testid={testId}
      >
        {options.map((option) => (
          <OptionListItem key={option.value} {...option} />
        ))}
      </OptionList>
      <FieldError id={errorId}>{message}</FieldError>
    </Stack>
  );
};
