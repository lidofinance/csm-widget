import { Text } from '@lidofinance/lido-ui';
import type { FileUploadItemDto } from 'modules/surveys-sdk/generated';
import { FC, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import type { RejectedDkgFile } from '../types';
import { DkgRejectedFiles } from './dkg-rejected-files';
import { DkgStagedRow } from './dkg-staged-row';
import { DkgUpload } from './dkg-upload';

export const DkgFilesField: FC<{ name?: string }> = ({ name = 'dkgFiles' }) => {
  const { control } = useFormContext();
  const { field } = useController<Record<string, FileUploadItemDto[]>>({
    name,
    control,
  });
  const staged: FileUploadItemDto[] = field.value ?? [];
  const [rejected, setRejected] = useState<RejectedDkgFile[]>([]);

  return (
    <div>
      <Text weight="bold">Upload DKG files</Text>
      <Text size="xs" color="secondary">
        Upload a DKG file with all the keys you&apos;ve generated (even if
        you&apos;re not uploading all of them)
      </Text>
      <DkgUpload
        mode="form"
        onAccepted={(items) =>
          field.onChange([...staged, ...(items as FileUploadItemDto[])])
        }
        onRejected={(r) => setRejected(r)}
      >
        {staged.map((f, i) => (
          <DkgStagedRow
            key={`${f.name}-${i}`}
            name={f.name}
            onRemove={() =>
              field.onChange(staged.filter((_, idx) => idx !== i))
            }
          />
        ))}
      </DkgUpload>
      <DkgRejectedFiles rejected={rejected} onDismiss={() => setRejected([])} />
    </div>
  );
};
