import styled from 'styled-components';
import { HatStyle } from '../styles';

export const FallbackWalletStyle = styled(HatStyle)`
  text-align: center;
  background: var(--lido-color-error);
  background-image: none !important;
  color: var(--lido-color-errorContrast);
`;
