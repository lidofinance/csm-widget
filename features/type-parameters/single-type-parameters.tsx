import {
  OPERATOR_TYPE,
  OPERATOR_TYPE_CURVE_ID,
} from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { getCurveMetadata, OPERATOR_TYPE_METADATA } from 'consts';
import {
  useCurveParameters,
  useNodeOperatorId,
  useOperatorCurveId,
} from 'modules/web3';
import { FC, ReactNode } from 'react';
import { Block, CompareParametersList, Stack } from 'shared/components';
import { DefColumnBackground, IcsColumnBackground } from 'shared/components';
import { IdvtcColumnBackground } from 'shared/components/parameters-list/styles';

type SingleTypeParametersProps = {
  type: OPERATOR_TYPE.CSM_ICS | OPERATOR_TYPE.CSM_IDVTC;
  action?: ReactNode;
};

export const SingleTypeParameters: FC<SingleTypeParametersProps> = ({
  type,
  action,
}) => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: operatorCurveId } = useOperatorCurveId(nodeOperatorId);

  const typeCurveId = OPERATOR_TYPE_METADATA[type].curveId;

  const currentCurveId =
    nodeOperatorId !== undefined &&
    operatorCurveId !== undefined &&
    operatorCurveId !== typeCurveId
      ? operatorCurveId
      : OPERATOR_TYPE_CURVE_ID.CSM_DEF;

  const { data: currentParams } = useCurveParameters(currentCurveId);
  const { data: typeParams } = useCurveParameters(typeCurveId);

  const currentTitle = getCurveMetadata(currentCurveId).title;

  const TypeColumnBackground =
    type === OPERATOR_TYPE.CSM_ICS
      ? IcsColumnBackground
      : IdvtcColumnBackground;

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
                  parameters: currentParams,
                  title: currentTitle,
                },
                {
                  parameters: typeParams,
                  title: OPERATOR_TYPE_METADATA[type].title,
                },
              ]}
            >
              <DefColumnBackground $index={0} />
              <TypeColumnBackground $index={1} />
            </CompareParametersList>
          </Block>
          {action}
        </Stack>
      </Stack>
    </Block>
  );
};
