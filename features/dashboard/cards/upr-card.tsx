import { FC } from 'react';
import { useExternalLinks } from 'shared/hooks/use-csm-constants';
import { usePerformanceApi } from '../hooks/use-performance-api';
import { UprCardView } from './upr-card-view';

export const UprCard: FC = () => {
  const { data, isPending, isError } = usePerformanceApi();
  const { migalabs } = useExternalLinks();

  return (
    <UprCardView
      data={data}
      isPending={isPending}
      isError={isError}
      sourceHref={migalabs}
    />
  );
};
