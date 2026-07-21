import { FC, useCallback } from 'react';
import { Loader, Text } from '@lidofinance/lido-ui';
import { Block, Counter, SectionTitle, Stack } from 'shared/components';
import { useShowRule } from 'shared/hooks';
import { IdvtcSiwePage } from '../idvtc-siwe-page';
import { DkgAddFileButton } from './components/dkg-add-file-button';
import { DkgDropArea } from './components/dkg-drop-area';
import { DkgEmptyState } from './components/dkg-empty-state';
import { DkgFilesTable } from './components/dkg-files-table';
import { DkgRejectedFiles } from './components/dkg-rejected-files';
import { DkgSignInPage } from './dkg-signin-page';
import { useDkgFiles } from './hooks/use-dkg-files';
import { useDkgUploadZone } from './hooks/use-dkg-upload-zone';
import { useUploadDkgFiles } from './hooks/use-upload-dkg-files';
import { DropArea } from './styles';
import type { DkgFileUploadItem } from './types';

const DkgFilesContent: FC = () => {
  const check = useShowRule();
  // Both the Manager and the Rewards address can manage DKG files.
  const canManage = check('HAS_MANAGER_ROLE') || check('HAS_REWARDS_ROLE');
  const { data: files, isLoading } = useDkgFiles();
  const upload = useUploadDkgFiles();

  const onAccepted = useCallback(
    (items: DkgFileUploadItem[]) => upload.mutate(items),
    [upload],
  );

  const zone = useDkgUploadZone({
    // A second drop while a POST is in flight fires a duplicate upload.
    disabled: !canManage || upload.isPending,
    onAccepted,
  });

  const content = (
    <Stack direction="column" gap="lg">
      <SectionTitle
        extra={
          canManage && (
            <DkgAddFileButton
              onClick={zone.open}
              loading={upload.isPending}
              disabled={upload.isPending}
            />
          )
        }
      >
        <Stack center gap="sm">
          Your DKG files
          <Counter
            count={files?.length ?? 0}
            showZero
            type="secondary"
            inverse={false}
            data-testid="dkgFilesCounter"
          />
        </Stack>
      </SectionTitle>

      {isLoading ? (
        <Loader />
      ) : files && files.length > 0 ? (
        <DkgFilesTable files={files} canManage={canManage} />
      ) : (
        <DkgEmptyState />
      )}

      <DkgRejectedFiles
        rejected={zone.rejected}
        onDismiss={zone.dismissRejected}
      />
      {upload.error && (
        <Text size="xs" color="error">
          Upload failed: {upload.error.message}
        </Text>
      )}
    </Stack>
  );

  return (
    <Block>
      {canManage ? (
        <DkgDropArea zone={zone}>{content}</DkgDropArea>
      ) : (
        <DropArea>{content}</DropArea>
      )}
    </Block>
  );
};

export const DkgFilesPage: FC = () => (
  <IdvtcSiwePage title="DKG" pageName="DKG" fallback={<DkgSignInPage />}>
    <DkgFilesContent />
  </IdvtcSiwePage>
);
