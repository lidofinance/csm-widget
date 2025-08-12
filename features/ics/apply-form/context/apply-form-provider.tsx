import { FC, PropsWithChildren, createContext, useContext, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useApplyFormNetworkData } from './use-apply-form-network-data';
import { useApplyFormValidation } from './use-apply-form-validation';
import { useGetDefaultValues } from './use-get-default-values';
import { useApplyFormSubmit } from './use-apply-form-submit';
import type {
  ApplyFormInputType,
  ApplyFormNetworkData,
  ApplyFormControllerValue,
} from './types';

// Form Data Context
const FormDataContext = createContext<ApplyFormNetworkData | null>(null);

export const useApplyFormData = () => {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error('useApplyFormData must be used within ApplyFormProvider');
  }
  return context;
};

// Form Controller Context
const FormControllerContext = createContext<ApplyFormControllerValue | null>(null);

export const useApplyFormController = () => {
  const context = useContext(FormControllerContext);
  if (!context) {
    throw new Error('useApplyFormController must be used within ApplyFormProvider');
  }
  return context;
};

export const ApplyFormProvider: FC<PropsWithChildren> = ({ children }) => {
  // 1. Fetch network data
  const [networkData, revalidate] = useApplyFormNetworkData();

  // 2. Setup validation
  const validationResolver = useApplyFormValidation(networkData);

  // 3. Get default values
  const asyncDefaultValues = useGetDefaultValues(networkData);

  // 4. Initialize React Hook Form
  const formObject = useForm<ApplyFormInputType>({
    defaultValues: asyncDefaultValues,
    resolver: validationResolver,
    mode: 'onChange',
  });

  const retryFire = () => {
    formObject.reset(asyncDefaultValues);
  };

  // 5. Setup submit handler
  const { submitAction, retryEvent } = useApplyFormSubmit({
    onConfirm: revalidate,
    onRetry: retryFire,
  });

  // 6. Create context values
  const formControllerValue = useMemo(
    (): ApplyFormControllerValue => ({
      onSubmit: submitAction,
      retryEvent,
    }),
    [submitAction, retryEvent]
  );

  // 7. Provide contexts
  return (
    <FormProvider {...formObject}>
      <FormDataContext.Provider value={networkData}>
        <FormControllerContext.Provider value={formControllerValue}>
          {children}
        </FormControllerContext.Provider>
      </FormDataContext.Provider>
    </FormProvider>
  );
};