import { OPERATOR_TYPE } from 'consts';
import { CURVE_VARIANTS } from 'shared/node-operator/curve-badge/styles';
import styled from 'styled-components';

type Props = {
  $warning?: boolean;
  $variant?: OPERATOR_TYPE;
};

export const CounterStyle = styled.span<Props>`
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xs}px;
  padding: 4px 5px;
  margin-block: -4px;
  line-height: 1;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 700;

  display: inline-flex;
  justify-content: center;
  align-items: center;
  align-self: center;

  background: ${({ $warning }) =>
    $warning
      ? `var(--lido-color-error)`
      : `var(--lido-color-backgroundSecondary)`};
  color: var(--lido-color-text);
  text-transform: capitalize;

  ${({ $variant }) => ($variant ? CURVE_VARIANTS[$variant] : '')}
`;
