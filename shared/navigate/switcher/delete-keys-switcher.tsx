import { Counter, Tag } from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import { FC, ReactNode } from 'react';
import { useInvalidKeysCount } from 'shared/counters';
import { ShowRuleProps, useFilterShowRules } from 'shared/hooks';
import {
  DeleteKeysCardDescriptionStyle,
  DeleteKeysCardStyle,
  DeleteKeysCardsStyle,
  DeleteKeysCardTitleStyle,
} from './styles';

export enum DeleteKeysSwitcherRoutes {
  REMOVE = 'REMOVE',
  EXIT = 'EXIT',
  EJECT = 'EJECT',
}

const InvalidKeysCounter: FC = () => {
  const count = useInvalidKeysCount();

  if (!count) return null;

  return (
    <Counter variant="error" dataTestId={{ root: 'navCounter' }}>
      {count}
    </Counter>
  );
};

type Item = ShowRuleProps & {
  title: string;
  value: DeleteKeysSwitcherRoutes;
  route: PATH;
  suffix?: () => ReactNode;
  description: string;
};

const items: Item[] = [
  {
    title: 'Remove',
    value: DeleteKeysSwitcherRoutes.REMOVE,
    route: PATH.KEYS_REMOVE,
    suffix: () => <InvalidKeysCounter />,
    showRules: ['HAS_MANAGER_ROLE'],
    description: 'Only keys that have not been deposited to yet can be removed',
  },
  {
    title: 'Exit',
    value: DeleteKeysSwitcherRoutes.EXIT,
    route: PATH.KEYS_EXIT,
    description:
      'Only keys that have been active for at least 256 epochs can be exited from the Consensus Layer',
  },
  {
    title: 'Eject',
    value: DeleteKeysSwitcherRoutes.EJECT,
    route: PATH.KEYS_EJECT,
    showRules: ['HAS_OWNER_ROLE'],
    suffix: () => <Tag variant="neutral">Emergency</Tag>,
    description:
      'Only keys that have been active for at least 256 epochs can be ejected using triggerable withdrawals',
  },
];

type Props = {
  active: DeleteKeysSwitcherRoutes;
};

export const DeleteKeysSwitcher: FC<Props> = ({ active }) => {
  const filteredItems = useFilterShowRules(items);

  return (
    <DeleteKeysCardsStyle>
      {filteredItems.map(({ value, route, suffix, title, description }) => {
        const isActive = active === value;

        return (
          <DeleteKeysCardStyle
            key={value}
            href={route}
            $active={isActive}
            aria-current={isActive ? 'page' : undefined}
            data-testid="deleteKeysCard"
          >
            <DeleteKeysCardTitleStyle>
              {title}
              {suffix?.()}
            </DeleteKeysCardTitleStyle>
            <DeleteKeysCardDescriptionStyle>
              {description}
            </DeleteKeysCardDescriptionStyle>
          </DeleteKeysCardStyle>
        );
      })}
    </DeleteKeysCardsStyle>
  );
};
