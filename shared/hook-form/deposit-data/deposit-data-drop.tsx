import { createContext, FC, PropsWithChildren, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
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

      const file = acceptedFiles[0];
      const reader = new FileReader();

      // read file as text file
      reader.onloadend = () => {
        const { result: resultAsText } = reader;

        setValue(fieldName, resultAsText, {
          shouldValidate: false,
          shouldDirty: true,
          shouldTouch: true,
        });
      };
      reader.readAsText(file);
    },
    [fieldName, setValue],
  );

  const { getRootProps, open, isDragAccept } = useDropzone({
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
        {children}
      </DropzoneStyle>
    </DepositDataDropContext.Provider>
  );
};
