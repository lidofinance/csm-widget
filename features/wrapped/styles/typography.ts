import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { CURVE_VARIANTS } from 'shared/node-operator/curve-badge/styles';
import styled from 'styled-components';

// Main typography hierarchy for slides
export const SlideHeading = styled.h2`
  font-size: 30px;
  font-weight: 700;
  margin: 0;
  color: inherit;
  line-height: 1.4;
`;

export const SlideCopy = styled.p`
  font-size: 22px;
  font-weight: 700;
  line-height: 1.4;
  color: inherit;
  max-width: 80%;
`;

// Stat display components - used in main slide content
export const StatValue = styled.span`
  font-size: 72px;
  font-weight: 700;
  line-height: 1;
  color: inherit;
`;

export const StatLabel = styled.span`
  font-size: 32px;
  font-weight: 700;
  line-height: 1.3;
  color: inherit;
`;

export const StatSub = styled.span`
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
  color: inherit;
`;

// Summary display components - smaller variants for outro slide grid
export const SummaryStatValue = styled.span`
  font-size: 52px;
  font-weight: 700;
  line-height: 1.2;
`;

export const SummaryStatLabel = styled.span`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
`;

export const BadgeWrapper = styled.div`
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
