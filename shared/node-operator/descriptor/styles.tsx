import styled from 'styled-components';
import { DescriptorCurveStyle } from '../curve-badge/styles';

export const DescriptorIdWrapperStyle = styled.span``;

export const DescriptorNumber = styled.span`
  font-weight: bold;
`;

export const DescriptorText = styled.span``;

export const DescriptorStyle = styled.span`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: normal;
  line-height: 20px;
  gap: ${({ theme }) => theme.spaceMap.sm}px;

  ${({ theme }) => theme.mediaQueries.lg} {
    gap: ${({ theme }) => theme.spaceMap.xs}px;
  }

  ${DescriptorCurveStyle} {
    padding-inline: 6px;
  }
`;

export const DescriptorRolesStyle = styled.span`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;
