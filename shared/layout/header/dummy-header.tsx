import { ReactComponent as HomeIcon } from 'assets/icons/home.svg';
import Link from 'next/link';
import { FC } from 'react';
import { LogoLido } from 'shared/components';
import HeaderTheme from './components/header-theme';
import { Nav, NavLink } from './components/navigation/styles';
import {
  DecorationsStyle,
  HeaderActionsStyle,
  HeaderContentStyle,
  HeaderStyle,
} from './styles';

export const DummyHeader: FC = () => (
  <HeaderStyle size="full" forwardedAs="header">
    <HeaderContentStyle>
      <LogoLido />
      <Nav>
        <Link href="/">
          <NavLink>
            <HomeIcon />
            <span>Main</span>
          </NavLink>
        </Link>
      </Nav>
      <HeaderActionsStyle>
        <HeaderTheme />
      </HeaderActionsStyle>
    </HeaderContentStyle>
    <DecorationsStyle />
  </HeaderStyle>
);
