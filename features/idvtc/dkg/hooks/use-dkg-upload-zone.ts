import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useProcessDkgFiles } from './use-process-dkg-files';
import type { DkgFileUploadItem, RejectedDkgFile } from '../types';

type UseDkgUploadZoneArgs = {
  disabled?: boolean;
  onAccepted: (items: DkgFileUploadItem[]) => void;
  onRejected: (rejected: RejectedDkgFile[]) => void;
};

// Wraps react-dropzone + DKG file processing into a single, presentation-free
// hook so the drop area, the "Add new file" button and the surrounding layout
// can be composed freely by the page and the in-flow form field.
export const useDkgUploadZone = ({
  disabled,
  onAccepted,
  onRejected,
}: UseDkgUploadZoneArgs) => {
  const process = useProcessDkgFiles();

  const handleFiles = useCallback(
    async (files: File[], preRejected: RejectedDkgFile[] = []) => {
      try {
        const { valid, rejected } = await process(files);
        const allRejected = [...preRejected, ...rejected];
        if (allRejected.length > 0) onRejected(allRejected);
        if (valid.length > 0) onAccepted(valid);
      } catch {
        // readFiles() is a Promise.all over FileReaders and rejects on the
        // first read error; surface every file in this batch as unreadable.
        onRejected([
          ...preRejected,
          ...files.map((f) => ({
            name: f.name,
            reason: 'Could not read file',
          })),
        ]);
      }
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

  return { getRootProps, getInputProps, open, isDragAccept };
};
