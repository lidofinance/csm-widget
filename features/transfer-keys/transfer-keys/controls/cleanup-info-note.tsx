import { WarningBlock } from 'shared/components';
import { useTransferKeysFormData } from '../context';

export const CleanupInfoNote = () => {
  const { needCleanup } = useTransferKeysFormData();

  if (!needCleanup) {
    return null;
  }

  return (
    <WarningBlock>
      To ensure correct positioning of the new keys in the priority queue, you
      will need to perform two transactions: keys transfer and queue cleanup.
      Both transactions will be executed sequentially
    </WarningBlock>
  );
};
