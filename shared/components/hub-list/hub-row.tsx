import { Body, IconChevronRight } from '@lidofinance/lido-app-ui';
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
  HubTitleRowStyle,
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
  | { href?: undefined; external?: undefined }
  | { href: PATH; external?: false }
  | { href: string; external: true };

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
  <Body color="disabled" as="span">
    {children}
  </Body>
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
          <Body weight="semibold" as="span">
            {title}
          </Body>
          {tag}
        </HubTitleRowStyle>
        {description && (
          <Body color="secondary" as="span">
            {description}
          </Body>
        )}
      </HubMainStyle>
      {(value || trailing) && (
        <HubAsideStyle>
          {value && (
            <Body as="span" color="default">
              {value}
            </Body>
          )}
          {trailing}
        </HubAsideStyle>
      )}
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
