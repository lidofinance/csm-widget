import { Link, LinkProps } from '@lidofinance/lido-ui';
import { FC, useCallback } from 'react';

import { trackMatomoEvent, WithMatomoEvent } from 'utils';

export const MatomoLink: FC<WithMatomoEvent<LinkProps>> = ({
  matomoEvent,
  ...props
}) => {
  const onClickHandler = useCallback(() => {
    trackMatomoEvent(matomoEvent);
  }, [matomoEvent]);

  return <Link {...props} onClick={onClickHandler} />;
};
