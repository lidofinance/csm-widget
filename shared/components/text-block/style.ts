import { StackStyle } from 'shared/components/stack/style';
import styled, { CSSProperties } from 'styled-components';

export type TextBlockStyleProps = {
  $warning?: boolean;
  $align?: CSSProperties['alignItems'];
};

export const TextBlockStyle = styled(StackStyle).attrs({
  $direction: 'column',
  $gap: 'xxs',
})<TextBlockStyleProps>`
  min-width: 100px;
  align-items: ${({ $align }) => $align ?? 'flex-start'};

  color: var(
    ${({ $warning }) => ($warning ? '--lido-color-error' : '--lido-color-text')}
  );

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    align-items: baseline;
    justify-content: ${({ $align }) =>
      $align === 'flex-end' ? 'flex-end' : 'space-between'};
  }
`;

export const TextBlockValue = styled(StackStyle).attrs({
  $direction: 'column',
  $gap: 'xxs',
})`
  align-items: inherit;

  ${({ theme }) => theme.mediaQueries.lg} {
    align-items: end;
  }
`;

export const TextBlockTitle = styled.h5`
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  font-weight: 400;

  display: flex;
  align-items: center;
  gap: 4px;
`;

export const TextBlockContent = styled.div<{ $size?: 'xs' | 'sm' }>`
  font-size: ${({ theme, $size = 'xs' }) => theme.fontSizesMap[$size]}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
  font-weight: 700;

  i {
    opacity: 0.5;
    font-style: normal;
  }
`;

export const GrayText = styled.div`
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  font-weight: 400;
  opacity: 0.5;
`;
