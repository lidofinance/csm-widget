import styled from 'styled-components';
import WarningIconSrc from 'assets/icons/attention-triangle.svg';

export const WarningIcon = styled.img.attrs({
  src: WarningIconSrc,
  alt: 'warning',
})`
  display: block;
  width: 58px;
  height: 51px;
`;

export const BannerWrapper = styled.div`
  padding-block: ${({ theme }) => theme.spaceMap.sm}px
    ${({ theme }) => theme.spaceMap.xxl}px;
`;
