import { KeysFile } from 'features/add-keys/add-keys/context';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

const useKeystoreDrop = (missingKeys: string[]) => {
  const [keysFiles, setKeysFiles] = useState<KeysFile[]>([]);
  const { setValue } = useFormContext();

  useEffect(() => {
    const keystores = [];
    for (const keystore of keysFiles) {
      keystores.push(keystore.content);
    }
    setValue('keystores', keystores, {
      shouldValidate: false,
      shouldDirty: true,
    });
  }, [keysFiles, setValue]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          try {
            const parsedContent = JSON.parse(reader.result as string) as {
              pubkey: string;
            };

            if (
              !parsedContent.pubkey ||
              !missingKeys.includes(parsedContent.pubkey)
            ) {
              alert(
                `The file "${file.name}" is missing a valid pubkey or it's not in the missing keys list.`,
              );
              return;
            }

            // Remove duplicated keys
            if (keysFiles.some((f) => f.name === file.name)) {
              alert(`File "${file.name}" is already uploaded.`);
              return;
            }

            setKeysFiles((prevFiles) => [
              ...prevFiles,
              { name: file.name, content: parsedContent },
            ]);
          } catch (e) {
            alert(`Failed to parse JSON in file "${file.name}"`);
          }
        };
        reader.readAsText(file);
      });
    },
    [keysFiles, missingKeys],
  );

  const removeFile = useCallback((fileName: string) => {
    setKeysFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName),
    );
  }, []);

  const { getRootProps } = useDropzone({
    maxFiles: missingKeys.length,
    onDrop,
    noKeyboard: true,
    multiple: true,
    accept: { 'application/json': ['.json'] },
  });

  return { getRootProps, keysFiles, removeFile, setKeysFiles };
};

export default useKeystoreDrop;
