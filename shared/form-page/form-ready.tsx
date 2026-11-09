import { Card, Skeleton, Stack } from '@lidofinance/lido-app-ui';
import { CSSProperties, FC, PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';
import { useFormDataPending } from 'shared/hook-form/form-controller/form-data-context';

const LABEL: CSSProperties = { width: '40%' };
const FIELD: CSSProperties = { height: 52 };
const AREA: CSSProperties = { height: 240 };

const FormSkeleton: FC = () => (
  <Card
    role="status"
    aria-busy="true"
    aria-label="Loading"
    data-testid="formSkeleton"
  >
    <Stack gap={16}>
      <Skeleton variant="text" style={LABEL} />
      <Skeleton variant="block" style={FIELD} />
      <Skeleton variant="text" style={LABEL} />
      <Skeleton variant="block" style={AREA} />
    </Stack>
  </Card>
);

export const FormReady: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading } = useFormState();
  const isPending = useFormDataPending();

  if (isLoading || isPending) return <FormSkeleton />;

  return <>{children}</>;
};
