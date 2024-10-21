import { Check, Input } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const StyledInput = styled(Input)`
  input + span {
    overflow: visible;
  }
`;

export const StyledChip = styled.span`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  margin: -2px 8px;

  border-radius: ${({ theme }) => theme.borderRadiusesMap.xs}px;
  background: rgba(83, 186, 149, 0.2);
  background: var(--lido-color-success);
  background: color-mix(in srgb, var(--lido-color-success) 20%, transparent);
`;

export const Icon = styled(Check).attrs({ width: 12, height: 12 })`
  border-radius: 90px;
  background: var(--lido-color-success);
  color: rgba(255, 255, 255, 0.75);
`;
