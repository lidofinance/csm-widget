import { Block } from '@lidofinance/lido-ui';
import React, { ComponentProps } from 'react';
import { Component } from 'types';
import { SectionContentStyle, SectionStyle } from './styles';

import { LocalLink } from '../local-link';
import { SectionTitle } from '../section-title/section-title';

type SectionComponent = Component<
  'section',
  {
    title?: React.ReactNode;
    href?: ComponentProps<typeof LocalLink>['href'];
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
