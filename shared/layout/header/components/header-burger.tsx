import { Button } from '@lidofinance/lido-ui';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { NAV_MOBILE_MEDIA } from 'styles/constants';

export const HeaderBurger: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <BurgerButtonStyle
      isOpen={isOpen}
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      onClick={() => {
        setIsOpen((prev) => !prev);
      }}
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
  size: 'sm',
  variant: 'text',
  color: 'secondary',
})<{ isOpen: boolean }>`
  display: none;
  position: relative;
  z-index: 99;

  padding: 0;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  flex-shrink: 1;
  min-width: unset;
  overflow: hidden;

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
