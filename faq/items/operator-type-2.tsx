import React from 'react';
import { Faq } from 'types';

export const OperatorType2: Faq = {
  title: 'What operator types exist?',
  anchor: 'what-operator-types-exist',
  content: (
    <div>
      <p>Currently there are three Node Operator types:</p>
      <ul>
        <li>
          CSM 0x01 operator - the default Node Operator type assigned to all new
          Node Operators joining CSM via the Default Gate;
        </li>
        <li>
          Identified Community Staker - the custom Node Operator type assigned
          to the new Node Operators joining via the Identified Community Stakers
          Gate. This type can also be claimed by the Node Operators who have
          passed the identification process after joining CSM via the Default
          Gate;
        </li>
        <li>
          Identified DVT Clusters (IDVTC) - the custom Node Operator type
          designed for DVT Clusters and creates a more capital-efficient path
          for independent stakers who are willing to identify themselves and
          operate validators collaboratively via DVT. This approach combines the
          trust properties of ICS with the operational resilience of DVT,
          aligning incentives for small independent operators who share
          validator rewards within a cluster.
        </li>
        <li>
          CSM 0x02 operator - the Node Operator type assigned to all Node
          Operators joining 0x02 CSM, designed for validators with 0x02
          withdrawal credentials and a balance of up to 2,048 ETH. Although it
          is shown as a Node Operator type, 0x02 CSM is a separate module, so it
          is possible to run validators in 0x01 CSM and 0x02 CSM at the same
          time, with a separate Node Operator in each module.
        </li>
      </ul>
    </div>
  ),
};
