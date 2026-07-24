import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { processDkgFiles } from '../utils/process-dkg-files';
import type { DkgFileUploadItem, RejectedDkgFile } from '../types';

type UseDkgUploadZoneArgs = {
  disabled?: boolean;
  onAccepted: (items: DkgFileUploadItem[]) => void;
};

// Wraps react-dropzone + DKG file processing into a single, presentation-free
// hook so the drop area, the "Add new file" button and the surrounding layout
// can be composed freely by the page and the in-flow form field. Owns the
// rejected-files state so both surfaces render <DkgRejectedFiles> identically.
export const useDkgUploadZone = ({
  disabled,
  onAccepted,
}: UseDkgUploadZoneArgs) => {
  const [rejected, setRejected] = useState<RejectedDkgFile[]>([]);

  const handleFiles = useCallback(
    async (files: File[], preRejected: RejectedDkgFile[] = []) => {
      try {
        const { valid, rejected: newlyRejected } = await processDkgFiles(files);
        const allRejected = [...preRejected, ...newlyRejected];
        if (allRejected.length > 0) setRejected(allRejected);
        if (valid.length > 0) onAccepted(valid);
      } catch {
        // readFiles() is a Promise.all over FileReaders and rejects on the
        // first read error; surface every file in this batch as unreadable.
        setRejected([
          ...preRejected,
          ...files.map((f) => ({
            name: f.name,
            reason: 'Could not read file',
          })),
        ]);
      }
    },
    [onAccepted],
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

  const dismissRejected = useCallback(() => setRejected([]), []);

  return {
    getRootProps,
    getInputProps,
    open,
    isDragAccept,
    rejected,
    dismissRejected,
  };
};
