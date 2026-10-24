import { Sidebar } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

import { ButtonGroup } from 'shared/node-operator/styles';

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

export const SidebarOperatorGroup = styled(ButtonGroup)`
  width: 100%;
  padding-bottom: 16px;

  > * {
    min-width: 0;
  }

  > :first-child:not(:last-child) {
    flex: 0 1 auto;
  }

  > :last-child {
    flex: 1 1 0;
  }
`;
