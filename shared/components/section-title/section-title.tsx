import { FC, PropsWithChildren, ReactNode } from 'react';
import { SectionHeaderStyle, SectionTitleStyle } from './styles';

type Props = {
  middle?: ReactNode;
  extra?: ReactNode;
};

export const SectionTitle: FC<PropsWithChildren<Props>> = ({
  children,
  middle,
  extra,
}) => {
  return (
    <SectionHeaderStyle data-testid="sectionHeader">
      <SectionTitleStyle>{children}</SectionTitleStyle>
      {middle}
      {extra}
    </SectionHeaderStyle>
  );
};
