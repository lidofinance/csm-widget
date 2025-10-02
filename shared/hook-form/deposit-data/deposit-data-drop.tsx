import { FC, PropsWithChildren, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { DropzoneStyle } from './styles';

type DepositKeysInputHookFormProps = {
  fieldName?: string;
};

export const DepositDataDrop: FC<
  PropsWithChildren<DepositKeysInputHookFormProps>
> = ({ fieldName = 'rawDepositData', children }) => {
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

  const { getRootProps } = useDropzone({
    onDrop,
    noKeyboard: true,
    noClick: true,
    multiple: false,
    accept: {
      'text/json': ['.json'],
    },
  });

  return <DropzoneStyle {...getRootProps()}>{children}</DropzoneStyle>;
};
