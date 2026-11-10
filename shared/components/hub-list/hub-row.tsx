import { BodyLarge, Caption, IconChevronRight } from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import { FC, ReactNode } from 'react';
import { ExternalLink } from 'shared/navigate/external-link';
import { LocalLink } from 'shared/navigate/local-link';
import styled from 'styled-components';
import {
  HubAsideStyle,
  HubChevronStyle,
  HubMainStyle,
  HubMediaStyle,
  HubRowStyle,
  HubTrailingStyle,
  HubTitleRowStyle,
  HubTitleTextStyle,
  hubRowCss,
  hubRowLinkCss,
} from './styles';

const RowLocalLinkStyle = styled(LocalLink)`
  ${hubRowCss}
  ${hubRowLinkCss}
`;

const RowExternalLinkStyle = styled(ExternalLink)`
  ${hubRowCss}
  ${hubRowLinkCss}
`;

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
      {media && <HubMediaStyle>{media}</HubMediaStyle>}
      <HubMainStyle>
        <HubTitleRowStyle>
          <BodyLarge weight="semibold" as="span" color="default">
            <HubTitleTextStyle>{title}</HubTitleTextStyle>
          </BodyLarge>
          {tag}
        </HubTitleRowStyle>
        {description && (
          <Caption color="secondary" as="span">
            {description}
          </Caption>
        )}
      </HubMainStyle>
      {value && (
        <HubAsideStyle>
          <BodyLarge as="span" color="default">
            {value}
          </BodyLarge>
        </HubAsideStyle>
      )}
      {trailing && <HubTrailingStyle>{trailing}</HubTrailingStyle>}
      {href && (
        <HubChevronStyle aria-hidden="true">
          <IconChevronRight />
        </HubChevronStyle>
      )}
    </>
  );

  if (!href) {
    return <HubRowStyle data-testid={dataTestId}>{content}</HubRowStyle>;
  }

  return external ? (
    <RowExternalLinkStyle href={href} data-testid={dataTestId}>
      {content}
    </RowExternalLinkStyle>
  ) : (
    <RowLocalLinkStyle href={href as PATH} data-testid={dataTestId}>
      {content}
    </RowLocalLinkStyle>
  );
};
