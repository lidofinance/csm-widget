import styled from 'styled-components';

export const StepsWrapper = styled.div<{ $backSolid?: boolean }>`
  --back-opacity: ${({ $backSolid }) => ($backSolid ? 1 : 0.4)};
  --current-opacity: 1;
  --next-opacity: 0.1;

  display: flex;
  flex-direction: 'row';
  gap: 24px;
  align-self: center;
`;

export const Step = styled.div<{ $type: -1 | 0 | 1 }>`
  display: block;
  width: 12px;
  height: 12px;
  border-radius: 6px;

  background: var(--lido-color-primary);
  opacity: ${({ $type }) =>
    $type === -1
      ? 'var(--back-opacity)'
      : $type === 1
        ? 'var(--next-opacity)'
        : 'var(--current-opacity)'};

  &:after {
    content: '';
    display: ${({ $type }) => ($type === 0 ? 'none' : 'block')};
    width: 24px;
    height: 3px;
    background: inherit;

    position: relative;
    top: calc(50% - 1.5px);
    left: ${({ $type }) => ($type === 1 ? '-24px' : '100%')};
  }
`;
