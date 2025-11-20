import { PATH } from 'consts';
import { FC, ReactNode } from 'react';
import { useRouterPath } from 'shared/hooks';
import { getIsActivePath } from 'utils';
import { TabLinkStyled } from './styles';

export type TabItemProps = {
  href: PATH;
  children: ReactNode;
  disabled?: boolean;
  extra?: ReactNode;
};

export const TabItem: FC<TabItemProps> = ({
  href,
  children,
  disabled = false,
  extra,
}) => {
  const pathname = useRouterPath();
  const isActive = getIsActivePath(pathname, href);

  if (disabled) {
    return (
      <TabLinkStyled
        as="span"
        aria-disabled={true}
        aria-current={isActive ? 'page' : undefined}
      >
        {children}
        {extra}
      </TabLinkStyled>
    );
  }

  return (
    <TabLinkStyled href={href} aria-current={isActive ? 'page' : undefined}>
      {children}
      {extra}
    </TabLinkStyled>
  );
};
