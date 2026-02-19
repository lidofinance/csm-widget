import {
  CSM_OPERATOR_TYPE,
  CSM_OPERATOR_TYPE_CURVE_ID,
} from '@lidofinance/lido-csm-sdk';
import { Button, Text } from '@lidofinance/lido-ui';
import { CSM_OPERATOR_TYPE_METADATA } from 'consts';
import { PATH } from 'consts/urls';
import {
  useCurveParameters,
  useNodeOperatorId,
  useOperatorType,
} from 'modules/web3';
import { FC } from 'react';
import { Block, CompareParametersList, Stack } from 'shared/components';
import { DefColumnBackground, IcsColumnBackground } from 'shared/components';
import { useShowFlags } from 'shared/hooks';
import { LocalLink } from 'shared/navigate';

export const TypeParameters: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: operatorType } = useOperatorType(nodeOperatorId);

  const { ICS_APPLY_ENABLED, CAN_CLAIM_ICS } = useShowFlags();

  const { data: defParams } = useCurveParameters(
    CSM_OPERATOR_TYPE_CURVE_ID.DEF,
  );
  const { data: icsParams } = useCurveParameters(
    CSM_OPERATOR_TYPE_CURVE_ID.ICS,
  );

  const canApply =
    !CAN_CLAIM_ICS &&
    ICS_APPLY_ENABLED &&
    operatorType !== CSM_OPERATOR_TYPE.ICS;

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
              leftTitle={
                CSM_OPERATOR_TYPE_METADATA[CSM_OPERATOR_TYPE.DEF].title
              }
              rightTitle={
                CSM_OPERATOR_TYPE_METADATA[CSM_OPERATOR_TYPE.ICS].title
              }
            >
              <DefColumnBackground />
              <IcsColumnBackground />
            </CompareParametersList>
          </Block>
          {CAN_CLAIM_ICS && (
            <LocalLink href={PATH.TYPE_CLAIM}>
              <Button fullwidth size="sm">
                Go to claim
              </Button>
            </LocalLink>
          )}
          {canApply && (
            <LocalLink href={PATH.TYPE_ICS_APPLY}>
              <Button fullwidth size="sm">
                Apply for ICS
              </Button>
            </LocalLink>
          )}
        </Stack>
      </Stack>
    </Block>
  );
};
