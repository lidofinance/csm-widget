import { FC } from 'react';
import { InverseThemeProvider } from 'shared/components';
import styled from 'styled-components';
import { useAlertActions } from '../alert-provider';

const AlertContainerStyled = styled.div`
  position: absolute;
  top: 100%;
  right: 32px;
  width: 300px;

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;

  @media screen and (max-width: 1286px) {
    position: static;
    width: initial;
    max-width: 590px; /* like Main */
    margin: 0 auto;
    padding: 0 20px;
  }

  :not(:empty) {
    margin-top: 20px;
  }
`;

export const AlertContainer: FC = () => {
  const { alerts } = useAlertActions();

  return (
    <InverseThemeProvider>
      <AlertContainerStyled>
        {alerts.map((alert) => (
          <alert.component {...alert.props} key={alert.session} />
        ))}
      </AlertContainerStyled>
    </InverseThemeProvider>
  );
};
