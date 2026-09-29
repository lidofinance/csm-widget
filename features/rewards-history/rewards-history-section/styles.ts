import { SortButton } from 'providers/table-provider';
import { Table } from 'shared/components';
import { PubkeyContainerStyle } from 'shared/components/address/styles';
import styled, { css } from 'styled-components';
import { MEDIA_QUERY_XXL } from 'styles';

type TableStyleProps = {
  $balance?: boolean;
};

export const TableStyle = styled(Table)<TableStyleProps>`
  grid-template-columns:
    2fr 3fr 1fr 1fr 1fr 2fr
    ${({ $balance }) => ($balance ? '2fr' : '')};

  tr {
    ${({ $balance }) =>
      $balance &&
      css`
        padding-inline: 16px;
        gap: 12px;
      `}

    ${MEDIA_QUERY_XXL} {
      padding-inline: 16px;
      gap: 12px;

      ${PubkeyContainerStyle} {
        font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
      }
    }
  }

  th {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spaceMap.xs}px;
  }

  th:nth-child(n + 3):nth-child(-n + 7),
  td:nth-child(n + 3):nth-child(-n + 7) {
    justify-self: right;
    text-align: right;
  }
`;

export const Sort = styled(SortButton).attrs({ variant: 'arrow' })``;

export const DatesWrapper = styled.span`
  white-space: nowrap;
`;

export const PerformanceStyled = styled.span<{ $error?: boolean }>`
  font-weight: 700;

  ${({ $error }) =>
    $error &&
    css`
      color: var(--lido-color-error);
    `}
`;
