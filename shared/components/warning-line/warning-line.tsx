import styled from 'styled-components';

const WarningBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--lido-color-warning);

  padding: ${({ theme }) => theme.spaceMap.xs}px 20px;
`;

const WarningText = styled.span`
  text-align: center;
  line-height: 1.7;
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
