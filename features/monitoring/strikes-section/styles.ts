import styled from 'styled-components';

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  > * {
    position: relative;

    :not(:first-child) {
      :before {
        content: '';
        position: absolute;
        top: 0px;
        left: 0;
        width: 100%;
        height: 1px;
        background: var(--lido-color-popupMenuItemBgActiveHover);
        opacity: 0.12;
      }
    }
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 12px 0;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: grid;
    grid-auto-rows: auto;
    grid-column-gap: 1rem;
    grid-template-columns: 2fr 1fr;

    td:nth-child(3) {
      grid-column: 1 / -1;

      &:empty {
        display: none;
      }
    }

    th:nth-child(3) {
      display: none;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr;
  }

  > :last-child {
    min-width: fit-content;
  }
`;

export const Circle = styled.div<{ $red?: boolean }>`
  height: 12px;
  width: 12px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background: ${({ $red = false }) =>
    $red ? 'var(--lido-color-error)' : 'var(--lido-color-success)'};
  overflow: hidden;
  position: relative;
  white-space: nowrap;
`;
