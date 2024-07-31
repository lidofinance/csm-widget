import styled from 'styled-components';

export const StepsWrapper = styled.div`
  display: flex;
  flex-direction: 'row';
  gap: 24px;
  align-self: center;

  margin-top: -12px; // @style
`;

export const Step = styled.div<{ $type: -1 | 0 | 1 }>`
  display: block;
  width: 12px;
  height: 12px;
  border-radius: 6px;

  background: var(--lido-color-primary);
  opacity: ${({ $type }) => ($type === -1 ? 0.4 : $type === 1 ? 0.1 : 1)};

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
