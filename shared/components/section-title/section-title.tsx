import { ComponentProps, FC, PropsWithChildren, ReactNode } from 'react';
import {
  SectionHeaderLinkStyle,
  SectionHeaderStyle,
  SectionTitleStyle,
} from './styles';

import { ReactComponent as RoundedArrowIcon } from 'assets/icons/rounded-arrow.svg';
import { LocalLink } from 'shared/navigate';

type Props = Partial<
  Pick<ComponentProps<typeof LocalLink>, 'href' | 'matomoEvent'>
> & {
  middle?: ReactNode;
};

export const SectionTitle: FC<PropsWithChildren<Props>> = ({
  children,
  href,
  middle,
  ...props
}) => {
  const hasDecorator = !!href;

  return (
    <SectionHeaderStyle data-testid="sectionHeader">
      <SectionTitleStyle>{children}</SectionTitleStyle>
      {middle}
      {hasDecorator && (
        <SectionHeaderLinkStyle
          data-testid="sectionHeaderLink"
          href={href}
          {...props}
        >
          <RoundedArrowIcon />
        </SectionHeaderLinkStyle>
      )}
    </SectionHeaderStyle>
  );
};
