import { Block, Box, Text } from '@lidofinance/lido-ui';
import {
  FormTitle,
  IconTooltip,
  Latice,
  Pubkey,
  Stack,
} from 'shared/components';
import { useTransferKeysFormData } from '../context';

export const KeysSelector = () => {
  const { keys } = useTransferKeysFormData();

  return (
    <>
      <Stack center gap="sm">
        <FormTitle>Transfer keys to priority queue </FormTitle>
        <IconTooltip tooltip="Each ICS has a limited number of keys that can be transferred to the priority queue. This number is calculated as the maximum number of transferable keys minus the total number of keys that have ever been deposited by this Node Operator (including those that have already exited CSM). Keys available to move are automatically selected among all your keys in the legacy queue, starting from the first key that is closer to be head of the legacy queue." />
      </Stack>
      <Block color="background" paddingLess>
        <Box padding={16}>
          <Text size="xxs" weight={700} color="secondary">
            Why you might need to transfer your keys:
          </Text>
          <Text size="xxs" color="secondary">
            CSM now allows Identified Community Stakers (ICS) to move their keys
            from the legacy queue to the priority queue. Transferring keys to
            the priority queue may reduce waiting times in the CSM deposit
            queue, as keys in the priority queue are deposited before those in
            the legacy queue.
          </Text>
        </Box>
      </Block>
      <Latice>
        {keys?.map(({ pubkey }) => (
          <Pubkey key={pubkey} pubkey={pubkey} symbols={16} />
        ))}
      </Latice>
    </>
  );
};
