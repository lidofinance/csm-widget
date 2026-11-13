import styled from 'styled-components';

export const DescriptorIdWrapperStyle = styled.span``;

export const DescriptorNumber = styled.span<{ $bold: boolean }>`
  font-weight: ${({ $bold }) => ($bold ? 'bold' : 'inherit')};
`;

export const DescriptorText = styled.span``;
