import { ComponentProps, FC, PropsWithChildren } from 'react';
import {
  SectionHeaderLinkStyle,
  SectionHeaderStyle,
  SectionTitleStyle,
} from './styles';

import { ReactComponent as RoundedArrowIcon } from 'assets/icons/rounded-arrow.svg';
import { LocalLink } from '../local-link';

type Props = Partial<
  Pick<ComponentProps<typeof LocalLink>, 'href' | 'matomoEvent'>
>;

export const SectionTitle: FC<PropsWithChildren<Props>> = ({
  children,
  href,
  ...props
}) => {
  const hasDecorator = !!href;

  return (
    <SectionHeaderStyle>
      <SectionTitleStyle>{children}</SectionTitleStyle>
      {hasDecorator && (
        <SectionHeaderLinkStyle href={href} {...props}>
          <RoundedArrowIcon />
        </SectionHeaderLinkStyle>
      )}
    </SectionHeaderStyle>
  );
};
