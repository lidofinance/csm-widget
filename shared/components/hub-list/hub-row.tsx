import {
  BodyLarge,
  Description,
  IconChevronRight,
} from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import { FC, ReactNode } from 'react';
import { ExternalLink } from 'shared/navigate/external-link';
import { LocalLink } from 'shared/navigate/local-link';
import cn from 'classnames';
import s from './styles.module.css';

type LinkProps =
  { href?: PATH; external?: false } | { href: string; external: true };

export type HubRowProps = LinkProps & {
  media?: ReactNode;
  title: ReactNode;
  tag?: ReactNode;
  description?: ReactNode;
  value?: ReactNode;
  trailing?: ReactNode;
  dataTestId?: string;
};

export const HubRowEmptyValue: FC<{ children?: ReactNode }> = ({
  children = 'Not set',
}) => (
  <BodyLarge color="disabled" as="span">
    {children}
  </BodyLarge>
);

export const HubRow: FC<HubRowProps> = ({
  media,
  title,
  tag,
  description,
  value,
  trailing,
  href,
  external,
  dataTestId,
}) => {
  const content = (
    <>
      {media && <div className={s.media}>{media}</div>}
      <div className={s.main}>
        <div className={s.titleRow}>
          <BodyLarge weight="semibold" as="span" color="default">
            <span className={s.titleText}>{title}</span>
          </BodyLarge>
          {tag}
        </div>
        {description && (
          <Description color="secondary" as="span">
            {description}
          </Description>
        )}
      </div>
      {value && (
        <div className={s.aside}>
          <span className={s.value}>
            <BodyLarge as="span" color="default">
              {value}
            </BodyLarge>
          </span>
        </div>
      )}
      {trailing && <div className={s.trailing}>{trailing}</div>}
      {href && (
        <span className={s.chevron} aria-hidden="true">
          <IconChevronRight />
        </span>
      )}
    </>
  );

  if (!href) {
    return (
      <div className={s.hubRow} data-testid={dataTestId} data-wrap={!!trailing}>
        {content}
      </div>
    );
  }

  return external ? (
    <ExternalLink
      className={cn(s.hubRow, s.hubRowLink)}
      href={href}
      data-testid={dataTestId}
      data-wrap={!!trailing}
    >
      {content}
    </ExternalLink>
  ) : (
    <LocalLink
      className={cn(s.hubRow, s.hubRowLink)}
      href={href as PATH}
      data-testid={dataTestId}
      data-wrap={!!trailing}
    >
      {content}
    </LocalLink>
  );
};
