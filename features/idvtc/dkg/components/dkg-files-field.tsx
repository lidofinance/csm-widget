import { Text } from '@lidofinance/lido-ui';
import type { FileUploadItemDto } from 'modules/surveys-sdk/generated';
import { FC } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { FormTitle, Stack } from 'shared/components';
import { useDkgUploadZone } from '../hooks/use-dkg-upload-zone';
import { mergeDkgFiles } from '../utils/merge-dkg-files';
import {
  dkgBatchBytes,
  formatMegabytes,
  formatMegabytesFloor,
  MAX_TOTAL_BYTES,
} from '../utils/validate-dkg-batch';
import { DkgAddFileButton } from './dkg-add-file-button';
import { DkgDropArea } from './dkg-drop-area';
import { DkgStagedTable } from './dkg-files-table';
import { DkgRejectedFiles } from './dkg-rejected-files';
import { AddButtonRow } from '../styles';

export const DkgFilesField: FC<{ name?: string }> = ({ name = 'dkgFiles' }) => {
  const { control } = useFormContext();
  const { field, fieldState } = useController<
    Record<string, FileUploadItemDto[]>
  >({
    name,
    control,
  });
  const staged: FileUploadItemDto[] = field.value ?? [];

  const zone = useDkgUploadZone({
    onAccepted: (items) => field.onChange(mergeDkgFiles(staged, items)),
  });

  const bytes = dkgBatchBytes(staged);
  const isOverCap = bytes > MAX_TOTAL_BYTES;

  return (
    <>
      <DkgDropArea zone={zone}>
        <Stack direction="column" gap="xs">
          <FormTitle>Upload DKG files</FormTitle>
          <Text size="xxs" color="secondary">
            Upload a DKG file with all the keys you&apos;ve generated (even if
            you&apos;re not uploading all of them)
          </Text>
          <DkgStagedTable
            items={staged}
            onRemove={(index) =>
              field.onChange(staged.filter((_, idx) => idx !== index))
            }
          />
          {staged.length > 0 && (
            <Text size="xxs" color={isOverCap ? 'error' : 'secondary'}>
              Total {formatMegabytes(bytes)} /{' '}
              {formatMegabytesFloor(MAX_TOTAL_BYTES)}
            </Text>
          )}
          {fieldState.error?.message && (
            <Text size="xxs" color="error">
              {fieldState.error.message}
            </Text>
          )}
          <AddButtonRow>
            <DkgAddFileButton onClick={zone.open} />
          </AddButtonRow>
        </Stack>
      </DkgDropArea>

      <DkgRejectedFiles
        rejected={zone.rejected}
        onDismiss={zone.dismissRejected}
      />
    </>
  );
};
