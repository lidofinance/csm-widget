import {
  BlockStyled,
  CSMLogo,
  Header,
  Heading,
} from 'features/welcome/welcome-section/styles';
import { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;

  text-align: center;
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
`;

export const WelcomeSection: FC<PropsWithChildren> = ({ children }) => {
  return (
    <BlockStyled>
      <Heading>
        <CSMLogo />
        <Header>Community Staking Module</Header>
      </Heading>
      <ContentWrapper>{children}</ContentWrapper>
    </BlockStyled>
  );
};
