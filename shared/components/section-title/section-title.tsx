import { FC, PropsWithChildren } from 'react';
import {
  SectionHeaderLinkStyle,
  SectionHeaderStyle,
  SectionTitleStyle,
} from './styles';

import { ReactComponent as RoundedArrowIcon } from 'assets/icons/rounded-arrow.svg';

type Props = {
  href?: string;
};

export const SectionTitle: FC<PropsWithChildren<Props>> = ({
  href,
  children,
}) => {
  const hasDecorator = !!href;

  return (
    <SectionHeaderStyle>
      <SectionTitleStyle>{children}</SectionTitleStyle>
      {hasDecorator && (
        <SectionHeaderLinkStyle href={href}>
          <RoundedArrowIcon />
        </SectionHeaderLinkStyle>
      )}
    </SectionHeaderStyle>
  );
};
