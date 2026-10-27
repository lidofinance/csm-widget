import { Logo } from '@lidofinance/lido-app-ui';
import { FC } from 'react';

import { WIDGET_TITLE } from 'consts';
import { PATH } from 'consts/urls';

export const Logos: FC = () => (
  <Logo variant="compact" product={WIDGET_TITLE} href={PATH.HOME} />
);
