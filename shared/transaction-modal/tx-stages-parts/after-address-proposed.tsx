import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Address } from 'shared/components';
import styled from 'styled-components';

type Props = {
  address: string;
};

export const AfterAddressProposed: FC<Props> = ({ address }) => {
  return (
    <BlockStyled color="background">
      <b>What is next: </b>
      <br />
      <ol>
        <li>
          Connect to CSM UI with the proposed address
          <Text size="xxs">
            <Address address={address} showIcon />
          </Text>
        </li>
        <li>Go to Roles tab → Inbox requests to confirm the change</li>
      </ol>
    </BlockStyled>
  );
};

const BlockStyled = styled.div`
  text-align: left;
  line-height: 24px;

  background-color: var(--lido-color-backgroundSecondary);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  padding: ${({ theme }) => theme.spaceMap.md}px;
`;
