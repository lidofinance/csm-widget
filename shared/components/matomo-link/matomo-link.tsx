import { Link as ALink, LinkProps } from '@lidofinance/lido-ui';
import Link from 'next/link';
import { FC, useCallback } from 'react';

import { trackMatomoEvent, WithMatomoEvent } from 'utils';

export const MatomoLink: FC<WithMatomoEvent<LinkProps>> = ({
  matomoEvent,
  ...props
}) => {
  const onClickHandler = useCallback(() => {
    trackMatomoEvent(matomoEvent);
  }, [matomoEvent]);

  return (
    <Link href={props.href || ''} passHref legacyBehavior>
      {/* TODO: fix when go to Next v13+ */}
      {/* see: https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#link-component */}
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <ALink {...props} onClick={onClickHandler} />
    </Link>
  );
};
