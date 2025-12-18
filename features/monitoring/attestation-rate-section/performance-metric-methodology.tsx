import { Text } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { FC } from 'react';
import { MatomoLink, Stack } from 'shared/components';
import {
  AccordionWrapper,
  FormulaBadge,
  FormulaOperator,
  FormulaWrapper,
} from './styles';

export const PerformanceMetricMethodology: FC = () => {
  return (
    <AccordionWrapper
      summary={
        <Text size="xxs" weight={700}>
          Unified performance metric methodology
        </Text>
      }
    >
      <Stack direction="column" gap="sm">
        <p>
          Performance of each key in CSM is calculated based on three
          parameters:
        </p>

        <ul>
          <li>
            Attestations (A<sub>eff</sub>)
          </li>
          <li>
            Block proposals (B<sub>eff</sub>)
          </li>
          <li>
            Sync committee participation (S<sub>eff</sub>)
          </li>
        </ul>

        <p>The resulting formula for key performance looks as follows:</p>

        <FormulaWrapper>
          <FormulaBadge>
            P<sub>key</sub>
          </FormulaBadge>
          <FormulaOperator>=</FormulaOperator>
          <FormulaBadge>
            C<sub>a</sub>
          </FormulaBadge>
          <FormulaOperator>×</FormulaOperator>
          <FormulaBadge>
            A<sub>eff</sub>
          </FormulaBadge>
          <FormulaOperator>+</FormulaOperator>
          <FormulaBadge>
            C<sub>b</sub>
          </FormulaBadge>
          <FormulaOperator>×</FormulaOperator>
          <FormulaBadge>
            B<sub>eff</sub>
          </FormulaBadge>
          <FormulaOperator>+</FormulaOperator>
          <FormulaBadge>
            C<sub>s</sub>
          </FormulaBadge>
          <FormulaOperator>×</FormulaOperator>
          <FormulaBadge>
            S<sub>eff</sub>
          </FormulaBadge>
        </FormulaWrapper>

        <p>
          Each parameter is multiplied by a corresponding coefficient (C
          <sub>x</sub>) that determines the parameter weight in the formula. The
          values of the effectiveness parameters are calculated based on the
          ratio of expected versus successful duties performed during the
          monitoring frame. The values of the coefficients (which can vary per
          Operator Type) are based on the weighting coefficients for these
          duties in Ethereum&apos;s Consensus Layer specification. Check out the
          detailed information{' '}
          <MatomoLink
            href="https://docs.lido.fi/staking-modules/csm/intro#rewards"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.monitoringRewardsDocsLink}
          >
            in the documentation
          </MatomoLink>
          .
        </p>
      </Stack>
    </AccordionWrapper>
  );
};
