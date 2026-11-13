import { MessageBox } from '@lidofinance/lido-app-ui';
import { FC } from 'react';

import { WIDGET_TITLE } from 'consts';

export const MaintenanceBanner: FC = () => (
  <MessageBox
    variant="warning"
    headline={`${WIDGET_TITLE} is under maintenance`}
  >
    Come back a while
  </MessageBox>
);
