import { BodyLarge } from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import {
  useModule,
  useNodeOperatorId,
  useOperatorMetadata,
} from 'modules/web3';
import { FC } from 'react';
import {
  HubList,
  HubRow,
  HubRowEmptyValue,
  HubSection,
} from 'shared/components';
import { useShowFlags } from 'shared/hooks';

export const MetadataSection: FC = () => {
  const { IS_CM } = useShowFlags();
  const nodeOperatorId = useNodeOperatorId();
  const { module } = useModule();
  const { data: metadata } = useOperatorMetadata({ nodeOperatorId, module });

  if (!IS_CM) return null;

  return (
    <HubSection
      title="Meta data"
      subtitle="Update the public information used to identify your operator"
      dataTestId="settingsMetadataSection"
    >
      <HubList>
        <HubRow
          title={metadata?.name || <HubRowEmptyValue />}
          description={
            metadata?.description && (
              <BodyLarge as="span" color="default">
                {metadata.description}
              </BodyLarge>
            )
          }
          href={PATH.SETTINGS_METADATA}
          dataTestId="metadataRow"
        />
      </HubList>
    </HubSection>
  );
};
