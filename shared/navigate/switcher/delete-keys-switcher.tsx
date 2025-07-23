import { Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts';
import { FC } from 'react';
import { Grid, RadioLocalLink, Stack } from 'shared/components';
import { CounterInvalidKeys } from 'shared/counters';
import { ChipStyle } from './styles';

export enum DeleteKeysSwitcherRoutes {
  REMOVE = 'REMOVE',
  EXIT = 'EXIT',
  EJECT = 'EJECT',
}

const items = [
  {
    title: 'Remove',
    value: DeleteKeysSwitcherRoutes.REMOVE,
    route: PATH.KEYS_REMOVE,
    suffix: <CounterInvalidKeys />,
    description: (
      <>
        Only keys that have <b>not been deposited</b> to yet can be removed
      </>
    ),
  },
  {
    title: 'Exit',
    value: DeleteKeysSwitcherRoutes.EXIT,
    route: PATH.KEYS_EXIT,
    description: (
      <>
        Only keys that have been <b>active for at least 256 epochs</b> can be
        exited from the Consensus Layer
      </>
    ),
  },
  {
    title: 'Eject',
    value: DeleteKeysSwitcherRoutes.EJECT,
    route: PATH.KEYS_EJECT,
    suffix: <ChipStyle>Emergency</ChipStyle>,
    description: (
      <>
        Only keys that have been <b>active for at least 256 epochs</b> can be
        ejected using triggerable withdrawals
      </>
    ),
  },
];

type Props = {
  active: DeleteKeysSwitcherRoutes;
};

export const DeleteKeysSwitcher: FC<Props> = ({ active }) => {
  return (
    <Grid>
      {items.map(({ value, route, suffix, title, description }) => (
        <RadioLocalLink key={value} $active={active === value} href={route}>
          <Stack direction="column" gap="md">
            <Stack gap="sm" center>
              <Text size="xs" weight={700}>
                {title}
              </Text>
              {suffix}
            </Stack>
            <Text color="secondary" size="xxs">
              {description}
            </Text>
          </Stack>
        </RadioLocalLink>
      ))}
    </Grid>
  );
};
