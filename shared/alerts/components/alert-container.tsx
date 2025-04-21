import { DarkThemeProvider } from '@lidofinance/lido-ui';
import { FC } from 'react';
import styled from 'styled-components';
import { useAlertActions } from '../alert-provider';
import { MEDIA_QUERY_XXL } from 'styles/constants';

const AlertContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;

  margin: 0 auto;

  :not(:empty) {
    margin-top: 20px;
  }

  grid-area: none;
  position: absolute;
  right: 32px;
  top: 80px;
  width: calc(50% - 400px);
  max-width: 300px;
  grid-area: none;

  ${MEDIA_QUERY_XXL} {
    width: calc(50% - 350px);
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    grid-area: alerts;
    position: static;
    width: 100%;
    max-width: var(--layout-main-width);
  }
`;

export const AlertContainer: FC = () => {
  const { alerts } = useAlertActions();

  return (
    <DarkThemeProvider>
      <AlertContainerStyled>
        {alerts.map((alert) => (
          <alert.component {...alert.props} key={alert.session} />
        ))}
      </AlertContainerStyled>
    </DarkThemeProvider>
  );
};
