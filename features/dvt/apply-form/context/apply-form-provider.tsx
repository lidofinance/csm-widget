import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFormDefaultValues,
} from 'shared/hook-form/form-controller';
import { CLUSTER_SIZE } from './consts';
import type { ClusterMember, DvtApplyFormInputType } from './types';
import { useApplyFormData } from './apply-data-provider';
import { useApplyFormSubmit } from './use-apply-form-submit';
import { useApplyFormValidation } from './use-apply-form-validation';
import { useFormPersist } from './use-form-persist';

const emptyMember: ClusterMember = {
  address: '',
  signature: '',
};

const createEmptyMembers = (): ClusterMember[] =>
  Array.from({ length: CLUSTER_SIZE }, () => ({ ...emptyMember }));

export const ApplyFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const { mainAddress } = useApplyFormData(true);
  const { stored, save, clear } = useFormPersist(mainAddress);
  const resolver = useApplyFormValidation();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const defaultValues = useFormDefaultValues(() => {
    const emptyDefaults: DvtApplyFormInputType = {
      clusterMembers: createEmptyMembers(),
      discordLink: '',
      telegramUsername: '',
      confirmed: false,
    };

    if (!stored) return emptyDefaults;

    return {
      ...emptyDefaults,
      ...stored,
      clusterMembers: stored.clusterMembers?.length
        ? stored.clusterMembers.map((m) => ({ ...emptyMember, ...m }))
        : emptyDefaults.clusterMembers,
      confirmed: false,
    };
  });

  const formObject = useForm<DvtApplyFormInputType>({
    defaultValues,
    resolver,
    mode: 'onChange',
  });

  const { watch } = formObject;

  useEffect(() => {
    const subscription = watch((values) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        const { confirmed: _, ...toPersist } = values;
        save(toPersist as Partial<DvtApplyFormInputType>);
      }, 1000);
    });
    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [watch, save]);

  const submitter = useApplyFormSubmit(clear);

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="dvtApply">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
