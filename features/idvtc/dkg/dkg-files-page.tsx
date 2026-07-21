import { FC, useState } from 'react';
import { Text } from '@lidofinance/lido-ui';
import { SiweAuthGate } from 'modules/siwe';
import { SurveysAuthProvider } from 'modules/surveys-sdk';
import type { FileUploadItemDto } from 'modules/surveys-sdk/generated';
import { Block, NoSSRWrapper, Stack } from 'shared/components';
import { useShowRule } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { IdvtcClusterSwitcher } from 'shared/navigate';
import { DkgFilesList } from './components/dkg-files-list';
import { DkgRejectedFiles } from './components/dkg-rejected-files';
import { DkgUpload } from './components/dkg-upload';
import { DkgSignInPage } from './dkg-signin-page';
import { useDkgFiles } from './hooks/use-dkg-files';
import { useUploadDkgFiles } from './hooks/use-upload-dkg-files';
import type { RejectedDkgFile } from './types';

const DkgFilesContent: FC = () => {
  const check = useShowRule();
  // Both the Manager and the Rewards address can manage DKG files.
  const canManage = check('HAS_MANAGER_ROLE') || check('HAS_REWARDS_ROLE');
  const { data: files, isLoading } = useDkgFiles();
  const upload = useUploadDkgFiles();
  const [rejected, setRejected] = useState<RejectedDkgFile[]>([]);

  return (
    <Block>
      <Stack direction="column" gap="lg">
        <Text as="h2" size="lg" weight="bold">
          Your DKG files {files?.length ?? 0}
        </Text>
        <DkgUpload
          mode="page"
          disabled={!canManage}
          loading={upload.isPending}
          onAccepted={(items) => upload.mutate(items as FileUploadItemDto[])}
          onRejected={(r) => setRejected(r)}
        >
          {isLoading ? (
            <Text size="xs">Loading…</Text>
          ) : files && files.length > 0 ? (
            <DkgFilesList files={files} canManage={canManage} />
          ) : (
            <Text size="xs">No DKG files yet</Text>
          )}
        </DkgUpload>
        <DkgRejectedFiles
          rejected={rejected}
          onDismiss={() => setRejected([])}
        />
        {upload.error && (
          <Text size="xs" color="error">
            Upload failed: {upload.error.message}
          </Text>
        )}
      </Stack>
    </Block>
  );
};

export const DkgFilesPage: FC = () => (
  <Layout title="DKG" pageName="DKG">
    <IdvtcClusterSwitcher />
    <NoSSRWrapper>
      <SurveysAuthProvider>
        <SiweAuthGate fallback={<DkgSignInPage />}>
          <DkgFilesContent />
        </SiweAuthGate>
      </SurveysAuthProvider>
    </NoSSRWrapper>
  </Layout>
);
