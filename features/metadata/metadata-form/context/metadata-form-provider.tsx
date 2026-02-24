import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFormDefaultValues,
} from 'shared/hook-form/form-controller';
import type { MetadataFormInputType, MetadataFormNetworkData } from './types';
import { useMetadataSubmit } from './use-metadata-submit';
import { useMetadataValidation } from './use-metadata-validation';

export const MetadataFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const resolver = useMetadataValidation();

  const defaultValues = useFormDefaultValues<
    MetadataFormInputType,
    MetadataFormNetworkData
  >((data) => ({
    name: data.currentName ?? '',
    description: data.currentDescription ?? '',
  }));

  const formObject = useForm<MetadataFormInputType>({
    defaultValues,
    resolver,
    mode: 'onChange',
  });

  const submitter = useMetadataSubmit();

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="metadata">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
