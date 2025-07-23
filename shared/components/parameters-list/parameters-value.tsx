import { InlineLoader, Text } from '@lidofinance/lido-ui';
import { FC, ReactNode } from 'react';

type ParametersValueProps = {
  loading?: boolean;
  values: ReactNode[];
};

export const ParametersValue: FC<ParametersValueProps> = ({
  loading,
  values,
}) => (
  <Text as="div" size="xs">
    {loading ? (
      <InlineLoader />
    ) : (
      <ul>
        {values.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
    )}
  </Text>
);
