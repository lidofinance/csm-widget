import { HeaderButton } from 'shared/layout/header/styles';
import styled from 'styled-components';
import { NAV_MOBILE_MEDIA } from 'styles/constants';
import { DescriptorText } from '../descriptor/styles';

export const ButtonStyle = styled(HeaderButton)`
  ${DescriptorText} {
    ${NAV_MOBILE_MEDIA} {
      display: none;
    }
  }
`;
