import { MODULE_NAME, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import {
  Body,
  Card,
  InfoTooltip,
  SectionTitle,
  Skeleton,
  Table,
  Tag,
} from '@lidofinance/lido-app-ui';
import { OPERATOR_TYPE_METADATA } from 'consts';
import {
  useCurveParameters,
  useNodeOperator,
  useOperatorCurveId,
} from 'modules/web3';
import { FC, ReactNode } from 'react';
import { StretchStack } from 'shared/components';
import { ICON_TOOLTIP_TEST_ID } from 'shared/components/icon-tooltip/test-ids';
import { useParameters } from 'shared/components/parameters-list/parameters';
import {
  useCurveMetadata,
  useOperatorTypeCurve,
  useOperatorTypeParameters,
} from 'shared/hooks';
import styled from 'styled-components';

type Props = {
  type: OPERATOR_TYPE.CSM_ICS | OPERATOR_TYPE.CSM_IDVTC;
};

type ParameterRow = ReturnType<typeof useParameters>[number];

const HeaderStyle = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

const ValuesStyle = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const HIDDEN_PARAMETERS = ['Penalty fee'];

const Values: FC<{ values?: ReactNode[] }> = ({ values }) =>
  values ? (
    <ValuesStyle>
      {values.map((value, index) => (
        <li key={index}>
          <Body as="span" color="secondary">
            {value}
          </Body>
        </li>
      ))}
    </ValuesStyle>
  ) : (
    <Skeleton variant="text" />
  );

const ColumnHeader: FC<{ title: string; current: boolean }> = ({
  title,
  current,
}) => (
  <HeaderStyle>
    {title}
    {current && <Tag variant="neutral">Current type</Tag>}
  </HeaderStyle>
);

export const TypeParametersCard: FC<Props> = ({ type }) => {
  // ICS/IDVTC live in CSM only: other modules and pre-operator contribute just the DEF baseline.
  const { nodeOperator } = useNodeOperator();
  const csmOperator =
    nodeOperator?.module === MODULE_NAME.CSM ? nodeOperator : undefined;
  const { data: operatorCurve } = useOperatorCurveId(csmOperator);

  const typeCurve = useOperatorTypeCurve(type);
  const defCurve = useOperatorTypeCurve(OPERATOR_TYPE.CSM_DEF);

  const holdsTarget =
    !!operatorCurve && operatorCurve.curveId === typeCurve?.curveId;
  const ownOtherCurve = !!operatorCurve && !holdsTarget;
  const baseCurve = ownOtherCurve ? operatorCurve : defCurve;

  const { data: baseParams } = useCurveParameters(baseCurve);
  const { data: typeParams } = useOperatorTypeParameters(type);
  const baseShort = useCurveMetadata(baseCurve)?.short ?? '';
  const baseTitle = ownOtherCurve ? baseShort : 'Default';

  const parameters = useParameters(MODULE_NAME.CSM).filter(
    ({ title }) => !HIDDEN_PARAMETERS.includes(title),
  );

  return (
    <Card dataTestId={{ root: 'typeParametersCard' }}>
      <StretchStack gap={24}>
        <SectionTitle title="Parameters" />
        <Table<ParameterRow>
          rows={parameters}
          rowKey={({ title }) => title}
          minWidth={560}
          columns={[
            {
              key: 'title',
              header: '',
              width: '32%',
              render: ({ title, help }) => (
                <Body as="span" data-testid="parameterTitle">
                  {title}{' '}
                  <InfoTooltip
                    dataTestId={ICON_TOOLTIP_TEST_ID}
                    content={help}
                  />
                </Body>
              ),
            },
            {
              key: 'base',
              header: (
                <ColumnHeader title={baseTitle} current={ownOtherCurve} />
              ),
              render: ({ render }) => (
                <Values values={baseParams && render(baseParams)} />
              ),
            },
            {
              key: 'type',
              header: (
                <ColumnHeader
                  title={OPERATOR_TYPE_METADATA[type].short}
                  current={holdsTarget}
                />
              ),
              render: ({ render }) => (
                <Values values={typeParams && render(typeParams)} />
              ),
            },
          ]}
        />
      </StretchStack>
    </Card>
  );
};
