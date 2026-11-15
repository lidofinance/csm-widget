import styled from 'styled-components';

export const DescriptorNumber = styled.span<{ $bold: boolean }>`
  font-weight: ${({ $bold }) => ($bold ? 'bold' : 'inherit')};
`;
