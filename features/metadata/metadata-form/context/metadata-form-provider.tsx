import { FC, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
  useFormDefaultValues,
} from 'shared/hook-form/form-controller';
import type { MetadataFormInputType, MetadataFormNetworkData } from './types';
import { useMetadataFlowResolver } from './use-metadata-flow';
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

  const submitter = useFlowSubmit(useMetadataFlowResolver());

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider
        submitter={submitter}
        formName="metadata"
        onReset={formObject.reset}
      >
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
