import { FC, PropsWithChildren } from 'react';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useMetadataFormData } from './context/metadata-data-provider';
import { Info } from './controls/info';

export const MetadataFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const { isOwner, ownerEditsRestricted } = useMetadataFormData();

  const canEdit = isOwner && !ownerEditsRestricted;

  return <FormLoader>{canEdit ? children : <Info />}</FormLoader>;
};
