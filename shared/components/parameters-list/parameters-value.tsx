import { InlineLoader, Text, TextProps } from '@lidofinance/lido-ui';
import { FC, ReactNode } from 'react';

type ParametersValueProps = {
  loading?: boolean;
  values: ReactNode[];
  size?: TextProps['size'];
};

export const ParametersValue: FC<ParametersValueProps> = ({
  loading,
  values,
  size = 'xs',
}) => (
  <Text as="div" size={size}>
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
