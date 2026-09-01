import { MODULE_NAME, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { OPERATOR_TYPE_METADATA } from 'consts';
import {
  useCurveParameters,
  useModule,
  useNodeOperatorId,
  useOperatorCurveId,
} from 'modules/web3';
import { FC, ReactNode } from 'react';
import { Block, CompareParametersList, Stack } from 'shared/components';
import { DefColumnBackground, IcsColumnBackground } from 'shared/components';
import { IdvtcColumnBackground } from 'shared/components/parameters-list/styles';
import {
  useCurveMetadata,
  useOperatorTypeCurveId,
  useOperatorTypeParameters,
} from 'shared/hooks';

type SingleTypeParametersProps = {
  type: OPERATOR_TYPE.CSM_ICS | OPERATOR_TYPE.CSM_IDVTC;
  action?: ReactNode;
};

export const SingleTypeParameters: FC<SingleTypeParametersProps> = ({
  type,
  action,
}) => {
  // ICS/IDVTC live in CSM only, so the whole comparison stays CSM-scoped:
  // an operator from another module contributes nothing but the DEF baseline.
  const { isCSM } = useModule();
  const nodeOperatorId = useNodeOperatorId();
  const { data: operatorCurveId } = useOperatorCurveId(
    isCSM ? nodeOperatorId : undefined,
  );

  const typeCurveId = useOperatorTypeCurveId(type);
  const defCurveId = useOperatorTypeCurveId(OPERATOR_TYPE.CSM_DEF);

  const currentCurveId =
    operatorCurveId !== undefined && operatorCurveId !== typeCurveId
      ? operatorCurveId
      : defCurveId;

  const { data: currentParams } = useCurveParameters(
    currentCurveId,
    undefined,
    MODULE_NAME.CSM,
  );
  const { data: typeParams } = useOperatorTypeParameters(type);

  const currentTitle =
    useCurveMetadata(currentCurveId, MODULE_NAME.CSM)?.title ?? '';

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
