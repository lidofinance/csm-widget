import {
  useController,
  UseControllerProps,
  UseControllerReturn,
} from 'react-hook-form';
import { FieldErrorState, getFieldErrorState } from './field-error-state';

export type UseFieldControllerProps = UseControllerProps & {
  showUntouched?: boolean;
};

export const useFieldController = ({
  showUntouched,
  ...props
}: UseFieldControllerProps): UseControllerReturn & FieldErrorState => {
  const controller = useController(props);
  const { field, fieldState, formState } = controller;

  return {
    ...controller,
    ...getFieldErrorState({
      error: fieldState.error,
      isTouched: fieldState.isTouched,
      isSubmitted: formState.isSubmitted,
      value: field.value,
      showUntouched,
    }),
  };
};
