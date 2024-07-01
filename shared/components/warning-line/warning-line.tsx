import styled from 'styled-components';

const WarningBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--lido-color-warning);
`;

const WarningText = styled.span`
  line-height: 32px;
  color: var(--lido-color-warningContrast);
`;

export const WarningLine = () => {
  return (
    <WarningBlock>
      <WarningText>
        This is devnet.1 version of the CSM widget. You should not use it.
      </WarningText>
    </WarningBlock>
  );
};
