import { ComponentProps, FC, PropsWithChildren } from 'react';
import {
  SectionHeaderLinkStyle,
  SectionHeaderStyle,
  SectionTitleStyle,
} from './styles';

import { ReactComponent as RoundedArrowIcon } from 'assets/icons/rounded-arrow.svg';
import { LocalLink } from '../local-link';

type Props = {
  href?: ComponentProps<typeof LocalLink>['href'];
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
