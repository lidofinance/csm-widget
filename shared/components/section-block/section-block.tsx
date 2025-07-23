import { Block } from '@lidofinance/lido-ui';
import { ComponentProps } from 'react';
import { Component } from 'types';
import { SectionContentStyle, SectionStyle } from './styles';

import { SectionTitle } from '../section-title/section-title';
import { SectionHeaderLink } from '../section-header-link';

type SectionComponent = Component<
  'section',
  Omit<ComponentProps<typeof SectionTitle>, 'children'> &
    Pick<ComponentProps<typeof SectionHeaderLink>, 'href' | 'matomoEvent'>
>;

export const SectionBlock: SectionComponent = ({
  title,
  href,
  matomoEvent,
  middle,
  children,
  ...rest
}) => (
  <Block>
    <SectionStyle {...rest}>
      <SectionTitle
        middle={middle}
        extra={
          href && (
            <SectionHeaderLink
              data-testid="sectionHeaderLink"
              {...{ href, matomoEvent }}
            />
          )
        }
      >
        {title}
      </SectionTitle>
      <SectionContentStyle>{children}</SectionContentStyle>
    </SectionStyle>
  </Block>
);
