import { Block } from '@lidofinance/lido-ui';
import { ComponentProps } from 'react';
import { Component } from 'types';
import { SectionContentStyle, SectionStyle } from './styles';

import { SectionTitle } from '../section-title/section-title';

type SectionComponent = Component<
  'section',
  Omit<ComponentProps<typeof SectionTitle>, 'children'>
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
      <SectionTitle {...{ href, matomoEvent, middle }}>{title}</SectionTitle>
      <SectionContentStyle>{children}</SectionContentStyle>
    </SectionStyle>
  </Block>
);
