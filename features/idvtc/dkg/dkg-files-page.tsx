import { FC, useCallback, useState } from 'react';
import { Text } from '@lidofinance/lido-ui';
import { SiweAuthGate } from 'modules/siwe';
import type { FileUploadItemDto } from 'modules/surveys-sdk/generated';
import {
  Block,
  Counter,
  NoSSRWrapper,
  SectionTitle,
  Stack,
} from 'shared/components';
import { useShowRule } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { IdvtcClusterSwitcher } from 'shared/navigate';
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
import type { DkgFileUploadItem, RejectedDkgFile } from './types';

const DkgFilesContent: FC = () => {
  const check = useShowRule();
  // Both the Manager and the Rewards address can manage DKG files.
  const canManage = check('HAS_MANAGER_ROLE') || check('HAS_REWARDS_ROLE');
  const { data: files, isLoading } = useDkgFiles();
  const upload = useUploadDkgFiles();
  const [rejected, setRejected] = useState<RejectedDkgFile[]>([]);

  const onAccepted = useCallback(
    (items: DkgFileUploadItem[]) => {
      // POST semantics are append-only, so names already stored would collide.
      const existing = new Set((files ?? []).map((f) => f.name));
      const duplicates = items.filter((i) => existing.has(i.name));
      const fresh = items.filter((i) => !existing.has(i.name));
      if (duplicates.length > 0) {
        setRejected((prev) => [
          ...prev,
          ...duplicates.map((d) => ({
            name: d.name,
            reason: 'File with this name already uploaded',
          })),
        ]);
      }
      if (fresh.length > 0) upload.mutate(fresh as FileUploadItemDto[]);
    },
    [files, upload],
  );

  const zone = useDkgUploadZone({
    // A second drop while a POST is in flight fires a duplicate upload.
    disabled: !canManage || upload.isPending,
    onAccepted,
    onRejected: (r) => setRejected(r),
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
        <Text size="xs">Loading…</Text>
      ) : files && files.length > 0 ? (
        <DkgFilesTable files={files} canManage={canManage} />
      ) : (
        <DkgEmptyState />
      )}

      <DkgRejectedFiles rejected={rejected} onDismiss={() => setRejected([])} />
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
  <Layout title="DKG" pageName="DKG">
    <IdvtcClusterSwitcher />
    <NoSSRWrapper>
      <SiweAuthGate fallback={<DkgSignInPage />}>
        <DkgFilesContent />
      </SiweAuthGate>
    </NoSSRWrapper>
  </Layout>
);
