import {
  OPERATOR_TYPE,
  OPERATOR_TYPE_CURVE_ID,
} from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { OPERATOR_TYPE_METADATA } from 'consts';
import { IcsApplyButton } from 'features/ics/apply-button';
import { useCurveParameters } from 'modules/web3';
import { FC } from 'react';
import { Block, CompareParametersList, Stack } from 'shared/components';
import { DefColumnBackground, IcsColumnBackground } from 'shared/components';
import { IdvtcColumnBackground } from 'shared/components/parameters-list/styles';
import { useShowFlags } from 'shared/hooks';

export const TypeParameters: FC = () => {
  const { ICS_APPLY_ENABLED, CAN_CLAIM_ICS } = useShowFlags();

  const { data: defParams } = useCurveParameters(
    OPERATOR_TYPE_CURVE_ID.CSM_DEF,
  );
  const { data: icsParams } = useCurveParameters(
    OPERATOR_TYPE_CURVE_ID.CSM_ICS,
  );
  const { data: idvtcParams } = useCurveParameters(
    OPERATOR_TYPE_CURVE_ID.CSM_IDVTC,
  );

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
              items={[
                {
                  parameters: defParams,
                  title: OPERATOR_TYPE_METADATA[OPERATOR_TYPE.CSM_DEF].title,
                },
                {
                  parameters: icsParams,
                  title: OPERATOR_TYPE_METADATA[OPERATOR_TYPE.CSM_ICS].title,
                },

                {
                  parameters: idvtcParams,
                  title: OPERATOR_TYPE_METADATA[OPERATOR_TYPE.CSM_IDVTC].title,
                },
              ]}
            >
              <DefColumnBackground $index={0} />
              <IcsColumnBackground $index={1} />
              <IdvtcColumnBackground $index={2} />
            </CompareParametersList>
          </Block>
          {(ICS_APPLY_ENABLED || CAN_CLAIM_ICS) && <IcsApplyButton size="sm" />}
        </Stack>
      </Stack>
    </Block>
  );
};
