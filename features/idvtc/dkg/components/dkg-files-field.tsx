import { Text } from '@lidofinance/lido-ui';
import type { FileUploadItemDto } from 'modules/surveys-sdk/generated';
import { FC, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { FormTitle } from 'shared/components';
import type { RejectedDkgFile } from '../types';
import { useDkgUploadZone } from '../hooks/use-dkg-upload-zone';
import { mergeDkgFiles } from '../utils/merge-dkg-files';
import { DkgAddFileButton } from './dkg-add-file-button';
import { DkgDropArea } from './dkg-drop-area';
import { DkgStagedTable } from './dkg-files-table';
import { DkgRejectedFiles } from './dkg-rejected-files';
import { AddButtonRow } from '../styles';

export const DkgFilesField: FC<{ name?: string }> = ({ name = 'dkgFiles' }) => {
  const { control } = useFormContext();
  const { field } = useController<Record<string, FileUploadItemDto[]>>({
    name,
    control,
  });
  const staged: FileUploadItemDto[] = field.value ?? [];
  const [rejected, setRejected] = useState<RejectedDkgFile[]>([]);

  const zone = useDkgUploadZone({
    onAccepted: (items) =>
      field.onChange(mergeDkgFiles(staged, items as FileUploadItemDto[])),
    onRejected: (r) => setRejected(r),
  });

  return (
    <>
      <FormTitle>Upload DKG files</FormTitle>
      <Text size="xxs" color="secondary">
        Upload a DKG file with all the keys you&apos;ve generated (even if
        you&apos;re not uploading all of them)
      </Text>
      <DkgDropArea zone={zone}>
        <DkgStagedTable
          items={staged}
          onRemove={(index) =>
            field.onChange(staged.filter((_, idx) => idx !== index))
          }
        />
        <AddButtonRow $align="start">
          <DkgAddFileButton onClick={zone.open} />
        </AddButtonRow>
      </DkgDropArea>
      <DkgRejectedFiles rejected={rejected} onDismiss={() => setRejected([])} />
    </>
  );
};
