import { Textarea } from '@lidofinance/lido-ui';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useController, useFormContext } from 'react-hook-form';
import { isValidationErrorTypeValidate } from 'shared/hook-form/validation/validation-error';
import styled from 'styled-components';

const TextareaStyle = styled(Textarea)`
  textarea {
    word-break: break-all;
    font-family: monospace;
    font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
    line-height: 1.6em;
  }
`;

type DepositKeysInputHookFormProps = Partial<
  React.ComponentProps<typeof Textarea>
> & {
  label?: string;
  fieldName?: string;
  showErrorMessage?: boolean;
};

export const DepositDataInputHookForm = ({
  fieldName = 'rawDepositData',
  label = 'Copy JSON with deposit data here',
  showErrorMessage = true,
  error: errorProp,
  ...props
}: DepositKeysInputHookFormProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name: fieldName });
  const hasErrorHighlight = isValidationErrorTypeValidate(error?.type);
  // allows to show error state without message
  const errorMessage = hasErrorHighlight && (error?.message || true);

  const { setValue } = useFormContext();

  const onDrop = useCallback(
    (acceptedFiles: Blob[]) => {
      if (acceptedFiles.length === 0) {
        // note this callback is run even when no files are accepted / all rejected
        // do nothing in such case
        return;
      }

      const file = acceptedFiles[0];
      const reader = new FileReader();

      // read file as text file
      reader.onloadend = () => {
        const { result: resultAsText } = reader;

        setValue(fieldName, resultAsText);
      };
      reader.readAsText(file);
    },
    [fieldName, setValue],
  );

  const { getRootProps } = useDropzone({
    onDrop,
    noKeyboard: true,
    noClick: true,
    multiple: false,
    accept: {
      'text/json': ['.json'],
    },
  });

  return (
    <div {...getRootProps()}>
      <TextareaStyle
        {...props}
        {...field}
        disabled={props.disabled ?? field.disabled}
        error={
          errorProp ?? (showErrorMessage ? errorMessage : hasErrorHighlight)
        }
        label={label}
        rows={6}
        fullwidth
      />
    </div>
  );
};
