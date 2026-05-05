import { Block } from '@lidofinance/lido-ui';
import styled, { css } from 'styled-components';
import { BadgeStyle } from 'shared/node-operator/role-badge/styles';
import { CURVE_VARIANTS } from 'shared/node-operator/curve-badge/styles';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';

export const OptionsWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;

export const OptionCard = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xxl}px;
`;

const IDVTC_GRADIENT = css`
  background: linear-gradient(91deg, #c4a8ff 2.95%, #f7a3cc 103.56%);
`;

export const TypeBadge = styled(BadgeStyle)<{ $variant: 'ICS' | 'IDVTC' }>`
  font-weight: 700;
  color: var(--lido-color-foreground);
  padding-inline: 6px;

  ${({ $variant }) =>
    $variant === 'ICS' ? CURVE_VARIANTS[OPERATOR_TYPE.ICS] : IDVTC_GRADIENT}
`;
