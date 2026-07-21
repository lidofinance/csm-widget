import { FC, PropsWithChildren, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ButtonIcon, Plus } from '@lidofinance/lido-ui';
import { useProcessDkgFiles } from '../hooks/use-process-dkg-files';
import type { DkgFileUploadItem, RejectedDkgFile } from '../types';
import { AddButtonRow, DropArea } from '../styles';

type DkgUploadProps = {
  mode: 'page' | 'form';
  disabled?: boolean;
  loading?: boolean;
  onAccepted: (items: DkgFileUploadItem[]) => void;
  onRejected: (rejected: RejectedDkgFile[]) => void;
};

export const DkgUpload: FC<PropsWithChildren<DkgUploadProps>> = ({
  mode,
  disabled,
  loading,
  onAccepted,
  onRejected,
  children,
}) => {
  const process = useProcessDkgFiles();

  const handleFiles = useCallback(
    async (files: File[], preRejected: RejectedDkgFile[] = []) => {
      const { valid, rejected } = await process(files);
      const allRejected = [...preRejected, ...rejected];
      if (allRejected.length > 0) onRejected(allRejected);
      if (valid.length > 0) onAccepted(valid);
    },
    [process, onAccepted, onRejected],
  );

  const { getRootProps, getInputProps, open, isDragAccept } = useDropzone({
    onDrop: (accepted, fileRejections) =>
      void handleFiles(
        accepted,
        fileRejections.map((r) => ({
          name: r.file.name,
          reason: 'Invalid file type',
        })),
      ),
    noClick: true,
    noKeyboard: true,
    multiple: true,
    disabled,
    accept: { 'application/json': ['.json'], 'text/json': ['.json'] },
  });

  if (disabled) {
    return <DropArea>{children}</DropArea>;
  }

  const addButton = (
    <AddButtonRow $align={mode === 'form' ? 'start' : undefined}>
      <ButtonIcon
        icon={<Plus />}
        variant="text"
        size="xs"
        onClick={open}
        loading={loading}
        type="button"
        aria-label="Add new file"
      >
        Add new file
      </ButtonIcon>
    </AddButtonRow>
  );

  return (
    <DropArea {...getRootProps()} $dragActive={isDragAccept}>
      <input {...getInputProps()} />
      {mode === 'form' ? (
        <>
          {children}
          {addButton}
        </>
      ) : (
        <>
          {addButton}
          {children}
        </>
      )}
    </DropArea>
  );
};
