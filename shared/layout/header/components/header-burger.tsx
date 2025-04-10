import { Button } from '@lidofinance/lido-ui';
import { useInpageNavigation } from 'providers/inpage-navigation';
import { FC } from 'react';
import styled from 'styled-components';
import { NAV_MOBILE_MEDIA } from 'styles/constants';

export const HeaderBurger: FC = () => {
  const { expanded, toggleExpanded } = useInpageNavigation();
  return (
    <BurgerButtonStyle
      aria-expanded={expanded}
      aria-label={expanded ? 'Close menu' : 'Open menu'}
      onClick={toggleExpanded}
    >
      <BurgerLine />
      <BurgerLine />
      <BurgerLine />
    </BurgerButtonStyle>
  );
};

export const BurgerLine = styled.div`
  width: 18px;
  height: 2px;
  border-radius: 2px;
  margin-block: 4px;

  background-color: var(--lido-color-text);
  transition:
    transform ease ${({ theme }) => theme.duration.norm},
    opacity ease ${({ theme }) => theme.duration.norm};
`;

export const BurgerButtonStyle = styled(Button).attrs({
  size: 'xs',
  variant: 'text',
  color: 'secondary',
})`
  display: none;

  width: 44px;
  height: 44px;
  min-width: unset;
  align-items: center;
  justify-content: center;
  flex-shrink: 1;
  padding: 0;

  ${NAV_MOBILE_MEDIA} {
    display: flex;
  }

  &[aria-expanded='true'] ${BurgerLine} {
    :nth-child(1) {
      transform: translateY(6px) rotate(-45deg);
    }
    :nth-child(2) {
      opacity: 0;
    }
    :nth-child(3) {
      transform: translateY(-6px) rotate(45deg);
    }
  }
`;
