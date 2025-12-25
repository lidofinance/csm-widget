import { ThemeName } from '@lidofinance/lido-ui';
import { HatBlock } from 'shared/components';
import styled from 'styled-components';

export const StyledBlock = styled(HatBlock)`
  --first-color: ${({ theme }) =>
    theme.name === ThemeName.light ? `#bfdbfe` : `#55657b`};
  --second-color: ${({ theme }) =>
    theme.name === ThemeName.light ? `#ccfbf1` : `#59837a`};

  background: linear-gradient(
      106deg,
      var(--first-color) 2.02%,
      var(--second-color) 99.17%
    ),
    linear-gradient(108deg, #e2e4fc -0.19%, #dcfcf5 91.74%);
`;
