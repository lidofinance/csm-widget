import { ReactComponent as RoundedArrowIcon } from 'assets/icons/rounded-arrow.svg';
import { ComponentProps, FC } from 'react';
import { LocalLink } from 'shared/navigate/local-link';
import { SectionHeaderLinkStyle } from './styles';

type SectionHeaderLinkProps = ComponentProps<typeof LocalLink>;

export const SectionHeaderLink: FC<SectionHeaderLinkProps> = ({
  as,
  'data-testid': dataTestId = 'sectionHeaderLink',
  ...props
}) => {
  return (
    <SectionHeaderLinkStyle data-testid={dataTestId} {...props}>
      <RoundedArrowIcon />
    </SectionHeaderLinkStyle>
  );
};
