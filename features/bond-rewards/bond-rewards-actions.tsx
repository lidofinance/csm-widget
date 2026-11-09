import { Button, Counter, IconPlus, Stack } from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { useShowRule } from 'shared/hooks';

export const BondRewardsActions: FC = () => {
  const check = useShowRule();

  return (
    <Stack
      direction={{ base: 'row', mdDown: 'column' }}
      align="stretch"
      gap={12}
      wrap
    >
      {check('HAS_ANY_ROLE') && (
        <Button
          href={PATH.BOND_CLAIM}
          variant="primary"
          fullWidth
          dataTestId={{ root: 'claimBondButton' }}
        >
          Claim Bond &amp; Rewards
        </Button>
      )}
      {check('HAS_LOCKED_BOND') && (
        <Button
          href={PATH.BOND_UNLOCK}
          variant="outline"
          fullWidth
          counter={<Counter variant="warning">1</Counter>}
          counterLabel="1 locked bond"
          dataTestId={{ root: 'compensateBondButton' }}
        >
          Compensate bond
        </Button>
      )}
      {check('IS_NODE_OPERATOR') && (
        <Button
          href={PATH.BOND_ADD}
          variant="outline"
          fullWidth
          iconLeft={<IconPlus />}
          dataTestId={{ root: 'addBondButton' }}
        >
          Add bond
        </Button>
      )}
    </Stack>
  );
};
