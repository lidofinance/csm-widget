import { FC } from 'react';

import { Crumb } from '../crumbs';
import { HeaderBurger } from './components/header-burger';
import HeaderTheme from './components/header-theme';
import HeaderWallet from './components/header-wallet';
import { Logos } from './components/logos';
import {
  HeaderActionsStyle,
  HeaderCrumbsStyle,
  HeaderLeftStyle,
  HeaderStyle,
} from './styles';

type Props = {
  dummy?: boolean | 'semi';
  crumbs: Crumb[];
};

export const Header: FC<Props> = ({ dummy, crumbs }) => (
  <HeaderStyle>
    <HeaderLeftStyle>
      <HeaderBurger />
      <Logos />
    </HeaderLeftStyle>
    <HeaderCrumbsStyle crumbs={crumbs} />
    <HeaderActionsStyle>
      <HeaderTheme />
      {dummy !== true && <HeaderWallet />}
    </HeaderActionsStyle>
  </HeaderStyle>
);
