import { Accordion, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { CompareParametersList, FormTitle } from 'shared/components';
import { useClaimTypeFormData } from '../context';
import styled from 'styled-components';

export const Info: FC = () => {
  const { currentParameters, newParameters } = useClaimTypeFormData();
  return (
    <>
      <FormTitle>Claim Identified Community Staker operator type</FormTitle>
      <Text size="xs">
        You are eligible to claim a new operator type. Claiming the Identified
        Community Staker operator type will change some parameters for your node
        operator according to the section below.
      </Text>
      <AccordionStyle summary="Parameters changes">
        <CompareParametersList
          current={currentParameters}
          new={newParameters}
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
