import {
  Header as LibHeader,
  Hidden,
  SidebarToggle,
  Stack,
} from '@lidofinance/lido-app-ui';
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
    <Stack direction="row" align="center" gap={12} grow>
      <SidebarToggle />
      <Hidden above="ml">
        <Logos />
      </Hidden>
      <Hidden below="md">
        <Stack direction="row" justify={{ ml: 'center' }} grow>
          <Crumbs crumbs={crumbs} />
        </Stack>
      </Hidden>
    </Stack>
  </LibHeader>
);
