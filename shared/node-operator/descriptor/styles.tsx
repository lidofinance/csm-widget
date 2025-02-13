import styled from 'styled-components';

export const DescriptorIdWrapperStyle = styled.span`
  span {
    font-weight: bold;
  }
`;

export const DescriptorStyle = styled.span`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: normal;
  line-height: 20px;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const DescriptorRolesStyle = styled.span`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;
