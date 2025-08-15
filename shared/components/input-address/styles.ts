import { Check, Input, Theme } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const StyledInput = styled(Input)`
  input + span {
    overflow: visible;
  }
`;

export type ChipProps = { color?: keyof Theme['colors'] };

export const StyledChip = styled.span<ChipProps>`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  margin: -2px 8px;

  border-radius: ${({ theme }) => theme.borderRadiusesMap.xs}px;
  background: ${({ color = 'success' }) => `var(--lido-color-${color})`};
  background: ${({ color = 'success' }) =>
    `color-mix(in srgb, var(--lido-color-${color}) 20%, transparent)`};
  color: ${({ color = 'success' }) => `var(--lido-color-${color})`};
  font-weight: 700;
`;

export const Icon = styled(Check).attrs({ width: 12, height: 12 })<ChipProps>`
  border-radius: 90px;
  background: ${({ color = 'success' }) => `var(--lido-color-${color})`};
  color: rgba(255, 255, 255, 0.75);
`;

export const AddressChip = styled.span`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  margin: -2px 8px;

  color: var(--lido-color-textSecondary);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xs}px;
  background: var(--lido-color-secondary);
  background: color-mix(in srgb, var(--lido-color-secondary) 10%, transparent);
`;
