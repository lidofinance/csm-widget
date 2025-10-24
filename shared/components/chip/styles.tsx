import { Chip } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const StyledChip = styled(Chip).attrs({ variant: 'gray' })`
  font-size: ${({ theme }) => theme.fontSizesMap.xxxs}px;
  vertical-align: middle;
`;

// TODO: can it extend Chip from lido-ui?
export const CustomStyledChip = styled.span`
  display: inline-flex;
  position: relative;
  overflow: hidden;
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xs}px;

  align-content: center;
  color: var(--lido-color-primary);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  font-weight: 700;

  :before {
    content: '';
    position: absolute;
    display: block;

    background-color: var(--lido-color-primary);
    transition: opacity 100ms ease 0s;
    opacity: 0.1;
    inset: 0px;
  }
`;

export const StyledOwnerChip = styled(CustomStyledChip)`
  font-weight: 400;
  color: var(--lido-color-textSecondary);
  background: color-mix(in srgb, currentColor 15%, transparent);
`;

export const StyledYouChip = styled(CustomStyledChip)``;
