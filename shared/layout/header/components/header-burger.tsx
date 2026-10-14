import { IconButton, IconMenu } from '@lidofinance/lido-app-ui';
import { useInpageNavigation } from 'providers/inpage-navigation';
import { FC } from 'react';
import styled from 'styled-components';

const BurgerStyle = styled(IconButton)`
  margin-inline: -8px;
`;

export const HeaderBurger: FC = () => {
  const { expanded, toggleExpanded } = useInpageNavigation();
  return (
    <BurgerStyle
      variant="ghost"
      icon={<IconMenu />}
      aria-expanded={expanded}
      aria-label={expanded ? 'Close menu' : 'Open menu'}
      onClick={toggleExpanded}
    />
  );
};
