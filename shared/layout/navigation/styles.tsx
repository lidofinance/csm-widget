import { Sidebar } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

// lib build puts the `animation` shorthand after `animation-timeline`, resetting it; re-apply until lido-app-ui ships longhands
export const SidebarStyle = styled(Sidebar)`
  @media (min-width: 1064px) {
    @supports (animation-timeline: scroll()) {
      && {
        animation-timeline: scroll(root);
        animation-range: 0 var(--local-offset);
      }
    }
  }
`;
