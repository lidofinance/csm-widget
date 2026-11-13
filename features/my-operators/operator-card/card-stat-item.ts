import { StatItem } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

export const CardStatItem = styled(StatItem)`
  && [class*='StatItem-module_label'] {
    font-size: var(--lido-app-ui-font-size-label);
    line-height: var(--lido-app-ui-line-height-label);
  }

  && [class*='StatItem-module_value'] {
    font-size: var(--lido-app-ui-font-size-body);
    line-height: var(--lido-app-ui-line-height-body);
    font-weight: var(--lido-app-ui-font-weight-semibold);
  }

  && [class*='StatItem-module_subValue'] {
    font-size: var(--lido-app-ui-font-size-label);
    line-height: var(--lido-app-ui-line-height-label);
    color: var(--lido-app-ui-color-text-tertiary);
  }
`;
