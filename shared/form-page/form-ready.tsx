import { Card, FormLayout, Skeleton, Stack } from '@lidofinance/lido-app-ui';
import { CSSProperties, FC, PropsWithChildren, ReactNode } from 'react';
import { useFormState } from 'react-hook-form';
import { useFormDataPending } from 'shared/hook-form/form-controller/form-data-context';

const LABEL: CSSProperties = { width: '40%' };
const FIELD: CSSProperties = { height: 52 };
const AREA: CSSProperties = { height: 240 };
const LOADING = {
  role: 'status',
  'aria-busy': 'true',
  'aria-label': 'Loading',
  'data-testid': 'formSkeleton',
} as const;

export const FormMainSkeletonContent: FC = () => (
  <Stack gap={16}>
    <Skeleton variant="text" style={LABEL} />
    <Skeleton variant="block" style={FIELD} />
    <Skeleton variant="text" style={LABEL} />
    <Skeleton variant="block" style={AREA} />
  </Stack>
);

export const FormAsideSkeletonContent: FC = () => (
  <Stack gap={16}>
    <Skeleton variant="text" />
    <Skeleton variant="text" />
    <Skeleton variant="text" />
    <Skeleton variant="block" style={FIELD} />
  </Stack>
);

const FormSkeleton: FC = () => (
  <Card {...LOADING}>
    <FormMainSkeletonContent />
  </Card>
);

export const FormMainAsideSkeleton: FC = () => (
  <FormLayout {...LOADING} aside={<FormAsideSkeletonContent />}>
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
