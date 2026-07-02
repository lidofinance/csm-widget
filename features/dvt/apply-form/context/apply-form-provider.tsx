import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
  useFormDefaultValues,
} from 'shared/hook-form/form-controller';
import { useDvtState } from 'features/dvt/shared';
import { CLUSTER_SIZE } from './consts';
import type { ClusterMember, DvtApplyFormInputType } from './types';
import { useApplyFormData } from './apply-data-provider';
import { useApplyFlowResolver } from './use-apply-flow';
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
  const { data } = useDvtState();
  const submittedAt = data
    ? new Date(data.updatedAt ?? data.createdAt).getTime()
    : undefined;
  const { draft, save, clear } = useFormPersist(mainAddress, submittedAt);
  const resolver = useApplyFormValidation();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const defaultValues = useFormDefaultValues(() => {
    const emptyDefaults: DvtApplyFormInputType = {
      clusterMembers: createEmptyMembers(),
      discordLink: '',
      telegramUsername: '',
      confirmed: false,
    };

    if (!draft) return emptyDefaults;

    const { savedAt: _savedAt, ...stored } = draft;

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

  const submitter = useFlowSubmit(useApplyFlowResolver(clear));

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="dvtApply">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
