import { Accordion, Text } from '@lidofinance/lido-ui';
import { getModuleOperatorType, OPERATOR_TYPE_METADATA } from 'consts';
import { FC } from 'react';
import { CompareParametersList, FormTitle } from 'shared/components';
import styled from 'styled-components';
import { useClaimIcsFormData } from '../context';

export const Info: FC = () => {
  const { currentParameters, newParameters, currentCurveId, newCurveId } =
    useClaimIcsFormData();

  const currentOperatorType = getModuleOperatorType(currentCurveId);
  const newOperatorType = getModuleOperatorType(newCurveId);
  return (
    <>
      <FormTitle>Claim Identified Community Staker operator type</FormTitle>
      <Text size="xs">
        You are eligible to claim a new operator type. Claiming the Identified
        Community Staker operator type will change some parameters for your node
        operator according to the section below.
      </Text>
      <AccordionStyle summary="Parameter changes">
        <CompareParametersList
          items={[
            {
              parameters: currentParameters,
              title: `Current (${OPERATOR_TYPE_METADATA[currentOperatorType].short})`,
            },
            {
              parameters: newParameters,
              title: `New (${OPERATOR_TYPE_METADATA[newOperatorType].short})`,
            },
          ]}
        />
      </AccordionStyle>
    </>
  );
};

const AccordionStyle = styled(Accordion)`
  background: var(--lido-color-backgroundSecondary);

  p {
    margin: 0;
  }
`;
