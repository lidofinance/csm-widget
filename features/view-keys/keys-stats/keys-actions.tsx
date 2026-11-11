import { Button, Counter, Skeleton, Stack } from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import { useOperatorInfo, useNodeOperatorId } from 'modules/web3';
import { FC } from 'react';
import { useInvalidKeysCount } from 'shared/counters';
import { useShowRule } from 'shared/hooks';

const PILL_SMALL = { width: 120, height: 48, borderRadius: 50 };
const PILL_LARGE = { width: 160, height: 48, borderRadius: 50 };

export const KeysActions: FC = () => {
  const check = useShowRule();
  const invalid = useInvalidKeysCount();
  const nodeOperatorId = useNodeOperatorId();
  const { isPending } = useOperatorInfo({ nodeOperatorId });

  if (isPending) {
    return (
      <Stack direction="row" wrap gap={12}>
        <Skeleton variant="block" style={PILL_LARGE} />
        <Skeleton variant="block" style={PILL_SMALL} />
      </Stack>
    );
  }

  const canManage = check('HAS_MANAGER_ROLE');

  return (
    <Stack direction="row" wrap gap={12}>
      {canManage && <Button href={PATH.KEYS_SUBMIT}>Submit new key</Button>}
      <Button
        variant="outline"
        href={PATH.KEYS_EXIT}
        disabled={!check('HAS_KEYS')}
        counter={
          canManage && invalid ? <Counter variant="error">1</Counter> : null
        }
      >
        Delete key
      </Button>
    </Stack>
  );
};
