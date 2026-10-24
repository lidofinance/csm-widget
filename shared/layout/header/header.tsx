import { Header as LibHeader, SidebarToggle } from '@lidofinance/lido-app-ui';
import { FC } from 'react';

import { Crumb, Crumbs } from '../crumbs';
import HeaderTheme from './components/header-theme';
import HeaderWallet from './components/header-wallet';
import { Logos } from './components/logos';

type Props = {
  dummy?: boolean | 'semi';
  crumbs: Crumb[];
};

export const Header: FC<Props> = ({ dummy, crumbs }) => (
  <LibHeader
    sticky
    actions={
      <>
        <HeaderTheme />
        {dummy !== true && <HeaderWallet />}
      </>
    }
  >
    <SidebarToggle logo={<Logos />} />
    <Crumbs crumbs={crumbs} />
  </LibHeader>
);
