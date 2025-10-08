import { Text } from '@lidofinance/lido-ui';
import { FormTitle } from 'shared/components';

export const Info = () => {
  return (
    <>
      <FormTitle>Queue cleaning</FormTitle>
      <Text size="xs">
        This operation removes empty batches from the deposit queue, helping to
        maintain the queue&#39;s efficiency and reduce gas costs for future
        operations
      </Text>
    </>
  );
};
