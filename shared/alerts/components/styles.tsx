import styled from 'styled-components';

// Inset column is viewport minus sidebar; wide enough for side alerts only from here
const ALERTS_BESIDE_COLUMN_MEDIA = '@media screen and (min-width: 1500px)';

export const AlertContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  box-sizing: border-box;
  width: 100%;
  max-width: calc(600px + var(--lido-app-ui-page-gutter) * 2);
  margin-inline: auto;
  padding: 8px var(--lido-app-ui-page-gutter) 0;

  :empty {
    display: none;
  }

  ${ALERTS_BESIDE_COLUMN_MEDIA} {
    position: absolute;
    right: 32px;
    top: 80px;
    width: calc((100% - 600px) / 2 - 64px);
    max-width: 300px;
    margin: 0;
    padding: 0;
  }
`;
