import { getModuleOperatorType, OPERATOR_TYPE_METADATA } from 'consts';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import {
  CompareParametersList,
  CompareParametersListItem,
} from 'shared/components';
import { ClaimIdvtcFormInputType, useClaimIdvtcFormData } from '../context';
import { AccordionStyle } from '../styles';

export const Parameters: FC = () => {
  const { currentParameters, newParameters, currentOperatorType, newCurveId } =
    useClaimIdvtcFormData(true);

  const mode = useWatch<ClaimIdvtcFormInputType, 'mode'>({ name: 'mode' });

  const newOperatorType = getModuleOperatorType(newCurveId);

  const items: CompareParametersListItem[] = [
    {
      parameters: currentParameters,
      title: `Current (${OPERATOR_TYPE_METADATA[currentOperatorType].short})`,
    },
    {
      parameters: newParameters,
      title: `New (${OPERATOR_TYPE_METADATA[newOperatorType].short})`,
    },
  ];

  return (
    <AccordionStyle summary="Parameter changes">
      <CompareParametersList
        items={mode === 'create' ? items.slice(1) : items}
      />
    </AccordionStyle>
  );
};
