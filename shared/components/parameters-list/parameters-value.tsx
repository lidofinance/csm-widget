import { Body, Skeleton } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';

type ParametersValueProps = {
  loading?: boolean;
  values: ReactNode[];
};

export const ParametersValue: FC<ParametersValueProps> = ({
  loading,
  values,
}) => (
  <Body as="div">
    {loading ? (
      <Skeleton variant="text" />
    ) : (
      <ul>
        {values.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
    )}
  </Body>
);
