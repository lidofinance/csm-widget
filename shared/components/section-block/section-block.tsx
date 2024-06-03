import React from 'react';
import { Component } from 'types';
import {
  SectionStyle,
  SectionHeaderStyle,
  SectionTitleStyle,
  SectionHeaderLinkStyle,
  SectionContentStyle,
} from './styles';
import { Block } from '@lidofinance/lido-ui';

import { ReactComponent as RoundedArrowIcon } from 'assets/icons/rounded-arrow.svg';

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
}) => {
  const hasDecorator = !!href;

  return (
    <Block>
      <SectionStyle {...rest}>
        <SectionHeaderStyle>
          <SectionTitleStyle>{title}</SectionTitleStyle>
          {hasDecorator && (
            <SectionHeaderLinkStyle href={href}>
              <RoundedArrowIcon />
            </SectionHeaderLinkStyle>
          )}
        </SectionHeaderStyle>
        <SectionContentStyle>{children}</SectionContentStyle>
      </SectionStyle>
    </Block>
  );
};
