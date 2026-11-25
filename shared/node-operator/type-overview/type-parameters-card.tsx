import { OPERATOR_TYPE, OPERATOR_TYPE_INFO } from '@lidofinance/lido-csm-sdk';
import {
  Body,
  Card,
  InfoTooltip,
  SectionTitle,
  Skeleton,
  Stack,
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
import { getTypeColumns } from './get-type-columns';
import s from './type-parameters-card.module.css';

type Props = {
  type:
    OPERATOR_TYPE.CSM_ICS | OPERATOR_TYPE.CSM_IDVTC | OPERATOR_TYPE.CSM2_DEF;
};

type ParameterRow = ReturnType<typeof useParameters>[number];

const HIDDEN_PARAMETERS = ['Penalty fee'];

const Values: FC<{ values?: ReactNode[]; strong?: boolean }> = ({
  values,
  strong,
}) =>
  values ? (
    <Stack as="ul" gap={8} className={s.values}>
      {values.map((value, index) => (
        <li key={index}>
          <Body as="span" color="default" weight={strong ? 'bold' : undefined}>
            {value}
          </Body>
        </li>
      ))}
    </Stack>
  ) : (
    <Skeleton variant="text" />
  );

const ColumnHeader: FC<{ title: string; current: boolean }> = ({
  title,
  current,
}) => (
  <Stack as="span" inline direction="row" wrap align="center" gap={8}>
    {title}
    {current && <Tag variant="neutral">Current type</Tag>}
  </Stack>
);

export const TypeParametersCard: FC<Props> = ({ type }) => {
  const { nodeOperator } = useNodeOperator();
  const { data: operatorCurve } = useOperatorCurveId(nodeOperator);

  const typeCurve = useOperatorTypeCurve(type);
  const defCurve = useOperatorTypeCurve(OPERATOR_TYPE.CSM_DEF);
  const { baseCurve, baseCurrent, baseOwnTitle, holdsTarget } = getTypeColumns({
    type,
    operatorCurve,
    typeCurve,
    defCurve,
  });

  const { data: baseParams } = useCurveParameters(baseCurve);
  const { data: typeParams } = useOperatorTypeParameters(type);
  const baseShort = useCurveMetadata(baseCurve)?.short ?? '';
  const baseTitle = baseOwnTitle ? baseShort : 'Default';

  const parameters = useParameters(OPERATOR_TYPE_INFO[type].module).filter(
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
              header: <ColumnHeader title={baseTitle} current={baseCurrent} />,
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
                <Values strong values={typeParams && render(typeParams)} />
              ),
            },
          ]}
        />
      </StretchStack>
    </Card>
  );
};
