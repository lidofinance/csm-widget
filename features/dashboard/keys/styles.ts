import { Accordion } from '@lidofinance/lido-ui';
import { StackStyle } from 'shared/components/stack/style';
import styled, { css } from 'styled-components';

export const Row = styled.div`
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  padding: 12px 16px;

  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 12px;

  background: var(--lido-color-backgroundSecondary);

  ${({ theme }) => theme.mediaQueries.lg} {
    grid-auto-flow: row;
  }
`;

export const ItemStyled = styled(StackStyle).attrs({
  $direction: 'column',
  $gap: 'xs',
})<{ $secondary?: boolean; $warning?: boolean; $reverse?: boolean }>`
  font-size: 14px;
  line-height: 20px;

  color: var(
    ${({ $secondary, $warning }) =>
      $secondary
        ? '--lido-color-textSecondary'
        : $warning
          ? '--lido-color-error'
          : '--lido-color-text'}
  );
  text-align: center;

  ${({ $reverse }) =>
    $reverse &&
    css`
      flex-direction: column-reverse;
      gap: 0px;
    `}

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row-reverse;
    justify-content: space-between;

    ${({ $reverse }) =>
      $reverse &&
      css`
        flex-direction: column-reverse;
      `}
  }
`;

export const CountStyled = styled.b`
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
`;

export const RowTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const AccordionStyle = styled(Accordion)<{ $warning?: boolean }>`
  --background: ${({ $warning }) =>
    $warning ? `var(--lido-color-error)` : `var(--lido-color-success)`};
  background: color-mix(in srgb, var(--background) 15%, transparent);

  margin: 0;

  & > div:first-child {
    padding: 20px;
  }

  & > div + div > div {
    padding: 0 20px 20px 20px;
  }

  ${Row} {
    padding: 0;
    background: transparent;
  }
`;

export const ActionStyled = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr;
  padding: 6px 8px;
  align-items: center;

  background: color-mix(in srgb, var(--lido-color-error) 10%, transparent);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr;
  }
`;

export const BoxStyled = styled.div`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const TitleStyled = styled(BoxStyled)`
  font-weight: 700;
  color: var(--lido-color-text);
`;
