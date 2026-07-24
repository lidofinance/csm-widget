import { FC } from 'react';
import styled from 'styled-components';

const TooltipText = styled.div`
  p + *,
  li + * {
    margin-top: ${({ theme }) => theme.spaceMap.xs}px;
  }
`;

export const MainAddressTooltipContent: FC = () => (
  <TooltipText>
    <p>
      If your application is approved, this Main address will be able to claim
      the IDVTC operator type.
    </p>
    <p>Choose the Main address based on your setup:</p>
    <ul>
      <li>
        If you are upgrading an existing Node Operator to IDVTC, use the owner
        address of that Node Operator.
      </li>
      <li>
        If you are creating a new Node Operator, use the address that should
        claim the IDVTC type. This is usually a multisig controlled by your
        cluster.
      </li>
    </ul>
  </TooltipText>
);
