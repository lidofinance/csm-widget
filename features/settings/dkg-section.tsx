import { PATH } from 'consts/urls';
import { useDkgFiles } from 'features/idvtc/dkg/hooks/use-dkg-files';
import { FC } from 'react';
import {
  HubList,
  HubRow,
  HubRowEmptyValue,
  HubSection,
} from 'shared/components';
import { useShowFlags } from 'shared/hooks';
import { formatDkgFilesRow } from './format-dkg-files-row';

const DkgSectionContent: FC<{ isCm: boolean }> = ({ isCm }) => {
  const { data: files } = useDkgFiles();
  const { title, value, isEmpty } = formatDkgFilesRow(files, isCm);

  return (
    <HubSection
      title="DKG files"
      subtitle={
        isCm
          ? 'Manage files used for distributed validator key generation'
          : undefined
      }
      dataTestId="settingsDkgSection"
    >
      <HubList>
        <HubRow
          title={title}
          value={isEmpty ? <HubRowEmptyValue>None</HubRowEmptyValue> : value}
          href={PATH.IDVTC_DKG}
          dataTestId="dkgFilesRow"
        />
      </HubList>
    </HubSection>
  );
};

export const DkgSection: FC = () => {
  const { IS_IDVTC, IS_CM } = useShowFlags();

  return IS_IDVTC ? <DkgSectionContent isCm={IS_CM} /> : null;
};
