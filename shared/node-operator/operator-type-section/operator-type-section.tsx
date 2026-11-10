import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { Stack } from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import type { DisplayOperatorType } from 'consts';
import { useNodeOperator, useOperatorCurveId } from 'modules/web3';
import { FC } from 'react';
import { HubList, HubRow, HubSection } from 'shared/components';
import {
  useCanCreate0x01,
  useCanCreate0x02,
  useDisplayOperatorType,
} from 'shared/hooks';
import { TypeBadge } from '../type-badge';
import { getAvailableTypes } from './get-available-types';

type TypeCopy = { title: string; description: string; href?: PATH };

const TYPE_COPY: Partial<Record<DisplayOperatorType, TypeCopy>> = {
  [OPERATOR_TYPE.CSM_DEF]: {
    title: '0x01',
    description: 'The simplest way to start validating in CSM',
  },
  [OPERATOR_TYPE.CSM_ICS]: {
    title: 'Identified Community Staker',
    description: 'Get verified and unlock better parameters',
    href: PATH.TYPE_ICS_SYSTEM,
  },
  [OPERATOR_TYPE.CSM_IDVTC]: {
    title: 'Identified DVT Cluster',
    description: 'Join a cluster of solo stakers to get better parameters',
    href: PATH.TYPE_IDVTC_DESCRIPTION,
  },
  [OPERATOR_TYPE.CSM2_DEF]: {
    title: '0x02',
    description: 'Validate up to 2,048 ETH per key for enhanced economics',
  },
};

type TypeRowProps = {
  type: DisplayOperatorType;
  href?: PATH;
  dataTestId: string;
};

const TypeRow: FC<TypeRowProps> = ({ type, href, dataTestId }) => {
  const copy = TYPE_COPY[type];
  if (!copy) return null;

  return (
    <HubRow
      media={<TypeBadge type={type} size={52} />}
      title={copy.title}
      description={copy.description}
      href={href}
      dataTestId={dataTestId}
    />
  );
};

export const OperatorTypeSection: FC = () => {
  const { nodeOperator } = useNodeOperator();
  const { data: curve } = useOperatorCurveId(nodeOperator);
  const displayType = useDisplayOperatorType(curve ?? nodeOperator);
  const current = nodeOperator ? displayType : undefined;
  const canCreate0x01 = useCanCreate0x01().canCreate;
  const canCreate0x02 = useCanCreate0x02().canCreate;

  const currentCopy = current && TYPE_COPY[current];
  const available = getAvailableTypes(current, {
    canCreate0x01,
    canCreate0x02,
  });

  return (
    <HubSection title="Operator Type" dataTestId="operatorTypeSection">
      <Stack direction="column" gap={8}>
        {current && currentCopy && (
          <HubList overline="CURRENT TYPE">
            <TypeRow
              type={current}
              href={currentCopy.href}
              dataTestId="operatorTypeCurrent"
            />
          </HubList>
        )}
        {available.length > 0 && (
          <HubList overline="AVAILABLE TYPES">
            {available.map(({ type, href }) => (
              <TypeRow
                key={type}
                type={type}
                href={href}
                dataTestId={`operatorTypeAvailable-${type}`}
              />
            ))}
          </HubList>
        )}
      </Stack>
    </HubSection>
  );
};
