import { createContext, FC, PropsWithChildren, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { readFileAsText } from 'utils/read-file-as-text';
import { DropzoneStyle } from './styles';
import { NOOP } from '@lidofinance/lido-ethereum-sdk';

export const DepositDataDropContext = createContext<() => void>(NOOP);

type DepositKeysInputHookFormProps = {
  fieldName?: string;
  error?: boolean;
};

export const DepositDataDrop: FC<
  PropsWithChildren<DepositKeysInputHookFormProps>
> = ({ fieldName = 'rawDepositData', children, error }) => {
  const { setValue } = useFormContext();

  const onDrop = useCallback(
    (acceptedFiles: Blob[]) => {
      if (acceptedFiles.length === 0) {
        // note this callback is run even when no files are accepted / all rejected
        // do nothing in such case
        return;
      }

      void readFileAsText(acceptedFiles[0])
        .then((text) =>
          setValue(fieldName, text, {
            shouldValidate: false,
            shouldDirty: true,
            shouldTouch: true,
          }),
        )
        .catch(() => undefined);
    },
    [fieldName, setValue],
  );

  const { getRootProps, getInputProps, open, isDragAccept } = useDropzone({
    onDrop,
    noKeyboard: true,
    noClick: true,
    multiple: false,
    accept: {
      'application/json': ['.json'],
      'text/json': ['.json'],
    },
  });

  return (
    <DepositDataDropContext.Provider value={open}>
      <DropzoneStyle {...getRootProps({ isDragAccept })} aria-invalid={error}>
        <input {...getInputProps()} />
        {children}
      </DropzoneStyle>
    </DepositDataDropContext.Provider>
  );
};
