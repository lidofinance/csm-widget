import { PATH } from 'consts';
import { FC, ReactNode, useMemo } from 'react';
import { Chip } from 'shared/components';
import { TabButtonStyled, TabListStyled } from 'shared/components/tabs/styles';
import { useRouterPath } from 'shared/hooks';
import { getIsActivePath } from 'utils';

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
  const pathname = useRouterPath();

  const activeIndex = useMemo(
    () => routes.findIndex(({ route }) => getIsActivePath(pathname, route)),
    [pathname],
  );

  return (
    <TabListStyled $size="md">
      {routes.map((item, index) => (
        <TabButtonStyled
          key={item.title}
          disabled={item.disabled}
          aria-current={activeIndex === index ? 'page' : undefined}
        >
          {item.title}
          {item.suffix}
        </TabButtonStyled>
      ))}
    </TabListStyled>
  );
};
