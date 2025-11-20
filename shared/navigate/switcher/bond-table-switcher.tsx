import { PATH } from 'consts';
import { FC, ReactNode } from 'react';
import { Chip, TabItem, TabsHeader } from 'shared/components';

type Item = {
  title: string;
  route: PATH;
  suffix?: ReactNode;
  disabled?: boolean;
};

const routes: Item[] = [
  {
    title: 'Node operator rewards',
    route: PATH.BOND_REWARDS_HISTORY,
  },
  {
    route: PATH.BOND_REBASE_HISTORY,
    title: 'Bond rebase',
    suffix: <Chip>Coming soon</Chip>,
    disabled: true,
  },
];

export const BondTableSwitcher: FC = () => {
  return (
    <TabsHeader>
      {routes.map((item) => (
        <TabItem
          key={item.title}
          href={item.route}
          disabled={item.disabled}
          extra={item.suffix}
        >
          {item.title}
        </TabItem>
      ))}
    </TabsHeader>
  );
};
