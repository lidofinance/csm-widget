import React from 'react';
import { Component } from 'types';
import { SectionStyle, SectionContentStyle } from './styles';
import { Block } from '@lidofinance/lido-ui';

import { SectionTitle } from '../section-title/section-title';

type SectionComponent = Component<
  'section',
  {
    title?: React.ReactNode;
    href?: string;
  }
>;

export const SectionBlock: SectionComponent = ({
  title,
  href,
  children,
  ...rest
}) => (
  <Block>
    <SectionStyle {...rest}>
      <SectionTitle href={href}>{title}</SectionTitle>
      <SectionContentStyle>{children}</SectionContentStyle>
    </SectionStyle>
  </Block>
);
