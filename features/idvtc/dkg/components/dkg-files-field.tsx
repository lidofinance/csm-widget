import {
  Caption,
  SectionTitle,
  Stack,
  Typography,
} from '@lidofinance/lido-app-ui';
import type { FileUploadItemDto } from 'modules/surveys-sdk/generated';
import { FC } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { FieldError } from 'shared/hook-form/fields/field-error';
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
        <Stack direction="column" gap={8} align="stretch">
          <SectionTitle title="Upload DKG files" />
          <Typography variant="body" color="tertiary">
            Upload a DKG file with all the keys you&apos;ve generated (even if
            you&apos;re not uploading all of them)
          </Typography>
          <DkgStagedTable
            items={staged}
            onRemove={(index) =>
              field.onChange(staged.filter((_, idx) => idx !== index))
            }
          />
          {staged.length > 0 && (
            <Caption color={isOverCap ? 'error' : 'secondary'}>
              Total {formatMegabytes(bytes)} /{' '}
              {formatMegabytesFloor(MAX_TOTAL_BYTES)}
            </Caption>
          )}
          {staged.length !== 1 && (
            <AddButtonRow>
              <DkgAddFileButton onClick={zone.open} />
            </AddButtonRow>
          )}
          <FieldError>{fieldState.error?.message}</FieldError>
        </Stack>
      </DkgDropArea>

      <DkgRejectedFiles
        rejected={zone.rejected}
        onDismiss={zone.dismissRejected}
      />
    </>
  );
};
