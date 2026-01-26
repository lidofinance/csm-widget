import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { CURVE_VARIANTS } from 'shared/node-operator/curve-badge/styles';
import styled, { css } from 'styled-components';

// Main typography hierarchy for slides
export const SlideHeading = styled.h2`
  font-size: 30px;
  font-weight: 700;
  margin: 0;
  line-height: 1.4;
`;

export const SlideCopy = styled.p`
  font-size: 22px;
  font-weight: 700;
  line-height: 1.4;
  max-width: 80%;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 18px;
    max-width: 100%;
  }
`;

// Stat display components - used in main slide content
export const StatValue = styled.span`
  font-size: 72px;
  font-weight: 700;
  line-height: 1;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 46px;
  }
`;

export const StatLabel = styled.span`
  font-size: 32px;
  font-weight: 700;
  line-height: 1.3;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 24px;
  }
`;

export const StatSub = styled.span`
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 18px;
  }
`;

// Summary display components - smaller variants for outro slide grid
export const SummaryStatValue = styled.span<{ $same?: boolean }>`
  font-size: 52px;
  font-weight: 700;
  line-height: 1.2;

  ${({ theme }) => theme.mediaQueries.md} {
    ${({ $same }) =>
      !$same &&
      css`
        font-size: 42px;
      `}
  }
`;

export const SummaryStatLabel = styled.span<{ $same?: boolean }>`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;

  ${({ theme }) => theme.mediaQueries.md} {
    ${({ $same }) =>
      !$same &&
      css`
        font-size: 14px;
      `}
  }
`;

export const BadgeWrapper = styled.div<{ $same?: boolean }>`
  position: relative;
  z-index: 0;
  padding: 10px 24px;

  font-weight: 700;
  font-size: 16px;
  letter-spacing: -0.5pt;
  color: var(--lido-color-foreground);
  text-align: center;

  border-radius: 14px;
  border: 2px solid rgba(var(--lido-rgb-foreground), 0.8);
  ${CURVE_VARIANTS[OPERATOR_TYPE.ICS]}
  background-origin: border-box;

  ${({ $same }) =>
    $same &&
    css`
      overflow: hidden;
    `}

  &:before {
    content: '';
    filter: blur(38px);
    opacity: 0.8;
    ${CURVE_VARIANTS[OPERATOR_TYPE.ICS]}
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
`;
