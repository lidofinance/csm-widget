import { Card, FormLayout, Skeleton, Stack } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { useFormState } from 'react-hook-form';
import { useFormDataPending } from 'shared/hook-form/form-controller/form-data-context';

export const FORM_SKELETON_PROPS = {
  role: 'status',
  'aria-busy': 'true',
  'aria-label': 'Loading',
  'data-testid': 'formSkeleton',
} as const;

export const FormMainSkeletonContent: FC = () => (
  <Stack gap={16}>
    <Skeleton variant="text" width="40%" />
    <Skeleton variant="block" height={52} />
    <Skeleton variant="text" width="40%" />
    <Skeleton variant="block" height={240} />
  </Stack>
);

export const FormAsideSkeletonContent: FC = () => (
  <Stack gap={16}>
    <Skeleton variant="text" />
    <Skeleton variant="text" />
    <Skeleton variant="text" />
    <Skeleton variant="block" height={52} />
  </Stack>
);

const FormSkeleton: FC = () => (
  <Card {...FORM_SKELETON_PROPS}>
    <FormMainSkeletonContent />
  </Card>
);

export const FormMainAsideSkeleton: FC = () => (
  <FormLayout {...FORM_SKELETON_PROPS} aside={<FormAsideSkeletonContent />}>
    <FormMainSkeletonContent />
  </FormLayout>
);

export const FormReady: FC<PropsWithChildren<{ skeleton?: ReactNode }>> = ({
  skeleton,
  children,
}) => {
  const { isLoading } = useFormState();
  const isPending = useFormDataPending();

  if (isLoading || isPending) return <>{skeleton ?? <FormSkeleton />}</>;

  return <>{children}</>;
};
