import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { Block } from '@lidofinance/lido-ui';
import { CURVE_VARIANTS } from 'shared/node-operator/curve-badge/styles';
import { BadgeStyle } from 'shared/node-operator/role-badge/styles';
import styled from 'styled-components';

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

export const TypeBadge = styled(BadgeStyle)<{ $variant: 'ICS' | 'IDVTC' }>`
  font-weight: 700;
  color: var(--lido-color-foreground);
  padding-inline: 6px;

  ${({ $variant }) =>
    $variant === 'ICS'
      ? CURVE_VARIANTS[OPERATOR_TYPE.CSM_ICS]
      : CURVE_VARIANTS[OPERATOR_TYPE.CSM_IDVTC]}
`;
