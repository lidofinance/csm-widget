import { Body, Card, SectionTitle } from '@lidofinance/lido-app-ui';
import { FC, useCallback, useState } from 'react';
import { PATH } from 'consts/urls';
import { Stack, WhenLoaded } from 'shared/components';
import { useHasNonWithdrawnKeys, useNodeOperatorId } from 'modules/web3';
import { useShowRule } from 'shared/hooks';
import { IdvtcSiwePage } from '../idvtc-siwe-page';
import { DkgAddFileButton } from './components/dkg-add-file-button';
import { DkgDropArea } from './components/dkg-drop-area';
import { DkgEmptyState } from './components/dkg-empty-state';
import { DkgFilesTable } from './components/dkg-files-table';
import { DkgRequiredCard } from './components/dkg-required-card';
import { DkgRejectedFiles } from './components/dkg-rejected-files';
import { DkgSignInPage } from './dkg-signin-page';
import { useDkgFiles } from './hooks/use-dkg-files';
import { useDkgUploadZone } from './hooks/use-dkg-upload-zone';
import { useUploadDkgFiles } from './hooks/use-upload-dkg-files';
import { DropArea } from './styles';
import type { DkgFileUploadItem } from './types';
import { validateDkgBatch } from './utils/validate-dkg-batch';

const DkgFilesContent: FC = () => {
  const check = useShowRule();
  // Both the Manager and the Rewards address can manage DKG files.
  const canManage = check('HAS_MANAGER_ROLE') || check('HAS_REWARDS_ROLE');
  const { data: files, isLoading } = useDkgFiles();
  const nodeOperatorId = useNodeOperatorId();
  const { data: hasNonWithdrawnKeys, isLoading: isKeysLoading } =
    useHasNonWithdrawnKeys(nodeOperatorId);
  const upload = useUploadDkgFiles();
  const [batchError, setBatchError] = useState<string>();

  const onAccepted = useCallback(
    (items: DkgFileUploadItem[]) => {
      const error = validateDkgBatch(items);
      if (error) {
        setBatchError(error);
        return;
      }
      setBatchError(undefined);
      upload.mutate(items);
    },
    [upload],
  );

  const zone = useDkgUploadZone({
    // A second drop while a POST is in flight fires a duplicate upload.
    disabled: !canManage || upload.isPending,
    onAccepted,
  });

  const showRequired = canManage && hasNonWithdrawnKeys && !files?.length;

  const messages = (
    <>
      <DkgRejectedFiles
        rejected={zone.rejected}
        onDismiss={zone.dismissRejected}
      />
      {batchError && <Body color="error">{batchError}</Body>}
      {upload.error && (
        <Body color="error">Upload failed: {upload.error.message}</Body>
      )}
    </>
  );

  const loading = isLoading || (canManage && isKeysLoading);

  if (showRequired) {
    return (
      <WhenLoaded loading={loading} morePadding>
        <DkgDropArea zone={zone}>
          <Stack direction="column" gap="lg">
            <DkgRequiredCard onAction={zone.open} />
            {messages}
          </Stack>
        </DkgDropArea>
      </WhenLoaded>
    );
  }

  const content = (
    <Stack direction="column" gap="lg">
      <SectionTitle
        title="Uploaded DKG files"
        action={
          canManage && (
            <DkgAddFileButton
              onClick={zone.open}
              loading={upload.isPending}
              disabled={upload.isPending}
            />
          )
        }
      />

      {files && files.length > 0 ? (
        <DkgFilesTable files={files} canManage={canManage} />
      ) : (
        <DkgEmptyState />
      )}

      {messages}
    </Stack>
  );

  return (
    <Card>
      <WhenLoaded loading={loading} morePadding>
        {canManage ? (
          <DkgDropArea zone={zone}>{content}</DkgDropArea>
        ) : (
          <DropArea>{content}</DropArea>
        )}
      </WhenLoaded>
    </Card>
  );
};

export const DkgFilesPage: FC = () => (
  <IdvtcSiwePage
    breadcrumbs={[
      { label: 'Settings', href: PATH.SETTINGS },
      { label: 'DKG files' },
    ]}
    pageName="DKG"
    fallback={<DkgSignInPage />}
  >
    <DkgFilesContent />
  </IdvtcSiwePage>
);
