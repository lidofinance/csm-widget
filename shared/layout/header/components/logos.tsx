import { Logo } from '@lidofinance/lido-app-ui';
import { FC } from 'react';

import { WIDGET_TITLE } from 'consts';
import { PATH } from 'consts/urls';
import { LocalLink } from 'shared/navigate';

export const Logos: FC = () => (
  <LocalLink href={PATH.HOME} asChild>
    <Logo variant="compact" product={WIDGET_TITLE} />
  </LocalLink>
);
