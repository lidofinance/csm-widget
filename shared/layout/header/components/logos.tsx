import { Logo } from '@lidofinance/lido-app-ui';
import { CSSProperties, FC } from 'react';

import { WIDGET_TITLE } from 'consts';
import { PATH } from 'consts/urls';
import { LocalLink } from 'shared/navigate';

export const Logos: FC = () => (
  <LocalLink href={PATH.HOME} asChild>
    <Logo
      variant="auto"
      product={WIDGET_TITLE}
      style={{ '--lido-app-ui-logo-breakpoint': '1063px' } as CSSProperties}
    />
  </LocalLink>
);
