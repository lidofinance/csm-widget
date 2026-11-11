import styled from 'styled-components';

type AlertContainerStyledProps = { $wide?: boolean };

const columnWidth = ({ $wide }: AlertContainerStyledProps) =>
  $wide ? 1000 : 600;

// Inset column is viewport minus sidebar; wide enough for side alerts only from here
const besideColumnMedia = ({ $wide }: AlertContainerStyledProps) =>
  `@media screen and (min-width: ${$wide ? 2000 : 1500}px)`;

export const AlertContainerStyled = styled.div<AlertContainerStyledProps>`
  display: flex;
  flex-direction: column;
  gap: 16px;

  box-sizing: border-box;
  width: 100%;
  max-width: calc(${columnWidth}px + var(--lido-app-ui-page-gutter) * 2);
  margin-inline: auto;
  padding: 8px var(--lido-app-ui-page-gutter) 0;

  :empty {
    display: none;
  }

  ${besideColumnMedia} {
    position: absolute;
    right: 32px;
    top: 80px;
    width: calc((100% - ${columnWidth}px) / 2 - 64px);
    max-width: 300px;
    margin: 0;
    padding: 0;
  }
`;
