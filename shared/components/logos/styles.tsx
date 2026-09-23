import styled from 'styled-components';

import { NAV_MOBILE_MEDIA } from 'styles/constants';

export const LogoLidoStyle = styled.div`
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;

  ${NAV_MOBILE_MEDIA} {
    width: 14px;
    justify-content: flex-start;
  }

  span {
    display: block;
  }
`;
