import { Skeleton } from '@lidofinance/lido-app-ui';
import { CSSProperties, FC, PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';
import { useFormDataPending } from 'shared/hook-form/form-controller/form-data-context';
import { SkeletonCardStyle } from './styles';

const LABEL: CSSProperties = { width: '40%' };
const FIELD: CSSProperties = { height: 52 };
const AREA: CSSProperties = { height: 240 };

const FormSkeleton: FC = () => (
  <SkeletonCardStyle
    role="status"
    aria-busy="true"
    aria-label="Loading"
    data-testid="formSkeleton"
  >
    <Skeleton variant="text" style={LABEL} />
    <Skeleton variant="block" style={FIELD} />
    <Skeleton variant="text" style={LABEL} />
    <Skeleton variant="block" style={AREA} />
  </SkeletonCardStyle>
);

export const FormReady: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading } = useFormState();
  const isPending = useFormDataPending();

  if (isLoading || isPending) return <FormSkeleton />;

  return <>{children}</>;
};
