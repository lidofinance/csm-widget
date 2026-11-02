import { FC, useId } from 'react';
import {
  OptionList,
  OptionListItem,
  OptionListItemProps,
  OptionListVariant,
} from 'shared/ui';
import { FieldError } from './field-error';
import { FieldStackStyle } from './styles';
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
  showUntouched?: boolean;
  'data-testid'?: string;
};

export const OptionCardsField: FC<OptionCardsFieldProps> = ({
  name,
  options,
  'aria-label': ariaLabel,
  variant = 'cards',
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
    <FieldStackStyle ref={ref}>
      <OptionList
        value={field.value ?? ''}
        onChange={field.onChange}
        onBlur={field.onBlur}
        variant={variant}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        aria-describedby={message ? errorId : undefined}
        data-testid={testId}
      >
        {options.map((option) => (
          <OptionListItem key={option.value} {...option} />
        ))}
      </OptionList>
      <FieldError id={errorId}>{message}</FieldError>
    </FieldStackStyle>
  );
};
