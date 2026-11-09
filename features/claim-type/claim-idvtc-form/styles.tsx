import { Card } from '@lidofinance/lido-app-ui';
import DkgFileWarning from 'assets/illustrations/dkg-file-warning.svg?react';
import styled from 'styled-components';

export const NarrowStyle = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

export const TwoCardsStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const CardsGridStyle = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 899px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const DkgCardStyle = styled(Card)`
  && {
    align-items: stretch;
  }
`;

export const DkgIllustration = styled(DkgFileWarning)`
  flex-shrink: 0;
  width: 93px;
  height: 100px;
  overflow: visible;
`;
