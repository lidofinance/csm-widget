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
          Permissionless operator - the default Node Operator type assigned to
          all new Node Operators joining CSM via the Permissionless Gate;
        </li>
        <li>
          Identified Community Staker - the custom Node Operator type assigned
          to the new Node Operators joining via the Identified Community Stakers
          Gate. This type can also be claimed by the Node Operators who have
          passed the identification process after joining CSM via the
          Permissionless Gate;
        </li>
        <li>
          Legacy EA operator - the custom Node Operator type assigned by default
          to the Early Adopters of CSM who have joined the module before the
          release of CSM v2.
        </li>
      </ul>
    </div>
  ),
};
