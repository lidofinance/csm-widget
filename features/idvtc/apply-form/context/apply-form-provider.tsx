import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControllerProvider,
  useFlowSubmit,
  useFormDefaultValues,
} from 'shared/hook-form/form-controller';
import { useIdvtcState } from 'features/idvtc/shared';
import { CLUSTER_SIZE } from './consts';
import type { ClusterMember, IdvtcApplyFormInputType } from './types';
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
  const { data } = useIdvtcState();
  const submittedAt = data
    ? new Date(data.updatedAt ?? data.createdAt).getTime()
    : undefined;
  const { draft, save, clear } = useFormPersist(mainAddress, submittedAt);
  const resolver = useApplyFormValidation();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const defaultValues = useFormDefaultValues(() => {
    const emptyDefaults: IdvtcApplyFormInputType = {
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

  const formObject = useForm<IdvtcApplyFormInputType>({
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
        save(toPersist as Partial<IdvtcApplyFormInputType>);
      }, 1000);
    });
    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [watch, save]);

  const submitter = useFlowSubmit(
    useApplyFlowResolver(formObject.setError, clear),
  );

  return (
    <FormProvider {...formObject}>
      <FormControllerProvider submitter={submitter} formName="dvtApply">
        {children}
      </FormControllerProvider>
    </FormProvider>
  );
};
