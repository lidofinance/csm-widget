import {
  OPERATOR_TYPE,
  OPERATOR_TYPE_CURVE_ID,
} from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { OPERATOR_TYPE_TITLE } from 'consts';
import { IcsApplyButton } from 'features/ics/apply-button';
import { useCurveParameters } from 'modules/web3';
import { FC } from 'react';
import { Block, CompareParametersList, Stack } from 'shared/components';
import { DefColumnBackground, IcsColumnBackground } from 'shared/components';
import { useShowFlags } from 'shared/hooks';

export const TypeParameters: FC = () => {
  const { ICS_APPLY_ENABLED, CAN_CLAIM_ICS } = useShowFlags();

  const { data: defParams } = useCurveParameters(OPERATOR_TYPE_CURVE_ID.DEF);
  const { data: icsParams } = useCurveParameters(OPERATOR_TYPE_CURVE_ID.ICS);

  return (
    <Block>
      <Stack gap="lg" direction="column">
        <Text size="xs">
          Explore the differences in node operator parameters across different
          node operator types:
        </Text>

        <Stack direction="column" gap="xxl">
          <Block padding="none">
            <CompareParametersList
              left={defParams}
              right={icsParams}
              leftTitle={OPERATOR_TYPE_TITLE[OPERATOR_TYPE.DEF]}
              rightTitle={OPERATOR_TYPE_TITLE[OPERATOR_TYPE.ICS]}
            >
              <DefColumnBackground />
              <IcsColumnBackground />
            </CompareParametersList>
          </Block>
          {(ICS_APPLY_ENABLED || CAN_CLAIM_ICS) && <IcsApplyButton size="sm" />}
        </Stack>
      </Stack>
    </Block>
  );
};
